import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Profile } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UsersService } from 'src/users/users.service';
import { RequestWithUser } from 'src/utils/interfaces/request';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('Profils')
@UseGuards(AuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer un nouveau profil',
    description: "Crée un profil pour l'utilisateur connecté",
  })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({ status: 201, description: 'Profil créé avec succès' })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé - Vous ne pouvez créer que votre propre profil',
  })
  @ApiResponse({ status: 403, description: 'Profil déjà existant' })
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @Req() request: RequestWithUser,
  ): Promise<Profile> {
    if (request.user.id !== createProfileDto.userId) {
      throw new HttpException('Unauthorized profile', HttpStatus.UNAUTHORIZED);
    }
    const profileAlreadyExist = await this.profilesService.findOne(
      createProfileDto.userId,
    );
    if (profileAlreadyExist) {
      throw new HttpException('Profile Already Exist', HttpStatus.FORBIDDEN);
    }
    return this.profilesService.create(createProfileDto);
  }

  @Get('all')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer tous les profils',
    description:
      'Retourne la liste de tous les profils (Admin et SuperAdmin uniquement)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des profils retournée avec succès',
  })
  @ApiResponse({
    status: 401,
    description:
      'Non autorisé - Bénévoles ne peuvent pas voir tous les profils',
  })
  async findAll(@Req() request: RequestWithUser) {
    const userRole = request.user.role;
    if (userRole === 'Volunteer') {
      throw new HttpException('Unauthorized profile', HttpStatus.UNAUTHORIZED);
    }
    return await this.profilesService.findAll();
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Récupérer le profil de l'utilisateur connecté",
    description: "Retourne le profil de l'utilisateur authentifié",
  })
  @ApiResponse({ status: 200, description: 'Profil retourné avec succès' })
  @ApiResponse({
    status: 401,
    description:
      'Non autorisé - Bénévoles ne peuvent voir que leur propre profil',
  })
  async findOne(@Req() request: RequestWithUser) {
    const userRole = request.user.role;
    const userToGet = await this.usersService.findOneById(request.user.id);
    if (userToGet.id !== request.user.id && userRole === 'Volunteer') {
      throw new HttpException('Unauthorized profile', HttpStatus.UNAUTHORIZED);
    }
    return await this.profilesService.findOne(request.user.id);
  }

  @Patch()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour le profil',
    description: "Met à jour le profil de l'utilisateur connecté",
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profil mis à jour avec succès' })
  @ApiResponse({
    status: 401,
    description:
      'Non autorisé - Vous ne pouvez modifier que votre propre profil',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur ou profil non trouvé' })
  async update(
    @Req() request: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userToUpdate = await this.usersService.findOneById(request.user.id);
    const profileTUpdate = await this.profilesService.findOne(request.user.id);

    if (!userToUpdate || !profileTUpdate) {
      throw new HttpException('User / Profile not found', HttpStatus.NOT_FOUND);
    }
    if (
      (userToUpdate.role === 'SuperAdmin' &&
        userToUpdate.id !== request.user.id) ||
      (userToUpdate.role === 'Admin' &&
        request.user.role !== 'SuperAdmin' &&
        userToUpdate.id !== request.user.id) ||
      (userToUpdate.role === 'Volunteer' &&
        request.user.role === 'Volunteer' &&
        userToUpdate.id !== request.user.id)
    ) {
      throw new HttpException('Unauthorized profile', HttpStatus.UNAUTHORIZED);
    }
    return await this.profilesService.update(request.user.id, updateProfileDto);
  }

  @Delete(':userId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Supprimer un profil',
    description: "Supprime le profil d'un utilisateur spécifique",
  })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur dont le profil doit être supprimé",
  })
  @ApiResponse({ status: 200, description: 'Profil supprimé avec succès' })
  @ApiResponse({
    status: 401,
    description:
      'Non autorisé - Vous ne pouvez supprimer que votre propre profil',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur ou profil non trouvé' })
  async remove(
    @Param('userId') userId: string,
    @Req() request: RequestWithUser,
  ) {
    const userToDelete = await this.usersService.findOneById(userId);
    const profileToDelete = await this.profilesService.findOne(userId);
    if (!userToDelete || !profileToDelete) {
      throw new HttpException('User / Profile not found', HttpStatus.NOT_FOUND);
    }
    if (
      (userToDelete.role === 'SuperAdmin' &&
        userToDelete.id !== request.user.id) ||
      (userToDelete.role === 'Admin' &&
        request.user.role !== 'SuperAdmin' &&
        userToDelete.id !== request.user.id) ||
      (userToDelete.role === 'Volunteer' &&
        request.user.role === 'Volunteer' &&
        userToDelete.id !== request.user.id)
    ) {
      throw new HttpException('Unauthorized profile', HttpStatus.UNAUTHORIZED);
    }
    return await this.profilesService.remove(userId);
  }
}
