import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
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
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/utils/interfaces/request';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Utilisateurs')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer tous les utilisateurs',
    description: 'Retourne la liste de tous les utilisateurs',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs retournée avec succès',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('info')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Récupérer les informations de l'utilisateur connecté",
    description: "Retourne les détails de l'utilisateur authentifié",
  })
  @ApiResponse({
    status: 200,
    description: 'Informations utilisateur retournées',
  })
  async findOneByToken(@Req() request: RequestWithUser) {
    return await this.usersService.findOneById(request.user.id);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer un utilisateur par ID',
    description: "Retourne les détails d'un utilisateur spécifique",
  })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({
    status: 401,
    description:
      'Non autorisé - Bénévoles ne peuvent voir que leur propre profil',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  findOne(@Param('id') id: string, @Req() request: RequestWithUser) {
    if (request.user.role === 'Volunteer' && request.user.id !== id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.usersService.findOneById(id);
  }

  @Get('/token/:token')
  @ApiOperation({
    summary: 'Récupérer un utilisateur par token de réinitialisation',
    description:
      'Retourne un utilisateur basé sur son token de réinitialisation de mot de passe',
  })
  @ApiParam({
    name: 'token',
    description: 'Token de réinitialisation de mot de passe',
  })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  findOneByResetPassToken(@Param('token') token: string) {
    console.log(
      '🚀 ~ UsersController ~ findOneByResetPassToken ~ token:',
      token,
    );
    return this.usersService.findOneByResetPassToken(token);
  }

  @Patch()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour le profil utilisateur',
    description: "Met à jour les informations de l'utilisateur connecté",
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Profil mis à jour avec succès' })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé ou mot de passe actuel incorrect',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: RequestWithUser,
  ) {
    const userToUpdate = await this.usersService.findOneById(request.user.id);
    if (!userToUpdate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (
      (updateUserDto.role && request.user.role !== 'SuperAdmin') ||
      (updateUserDto.refreshToken && request.user.id !== request.user.id) ||
      (userToUpdate.role === 'SuperAdmin' &&
        request.user.role !== 'SuperAdmin') ||
      (userToUpdate.role === 'Admin' &&
        request.user.role !== 'SuperAdmin' &&
        userToUpdate.id !== request.user.id) ||
      (userToUpdate.role === 'Volunteer' &&
        request.user.role === 'Volunteer' &&
        userToUpdate.id !== request.user.id)
    ) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (updateUserDto.password) {
      // compare password
      const isMatch = await this.authService.compare(
        request.body.actualPassword,
        userToUpdate.password,
      );

      if (!isMatch) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      updateUserDto.password = await this.authService.hash(
        updateUserDto.password,
      );
      updateUserDto = { password: updateUserDto.password };
    }

    return this.usersService.update(request.user.id, updateUserDto);
  }

  @Delete()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Supprimer le compte utilisateur',
    description: "Supprime le compte de l'utilisateur connecté",
  })
  @ApiResponse({ status: 200, description: 'Compte supprimé avec succès' })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé - Certains rôles ne peuvent pas être supprimés',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async remove(@Req() request: RequestWithUser) {
    const userToDelete = await this.usersService.findOneById(request.user.id);
    if (!userToDelete) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (
      userToDelete.role === 'SuperAdmin' ||
      (userToDelete.role === 'Admin' &&
        request.user.role !== 'SuperAdmin' &&
        userToDelete.id !== request.user.id) ||
      (userToDelete.role === 'Volunteer' &&
        request.user.role === 'Volunteer' &&
        userToDelete.id !== request.user.id)
    ) {
      throw new HttpException(
        'Unauthorized user deletion',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.usersService.remove(request.user.id);
  }
}
