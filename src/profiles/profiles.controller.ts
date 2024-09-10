import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/utils/interfaces/request';
import { UsersService } from 'src/users/users.service';

@ApiTags('Profiles')
@UseGuards(AuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
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
  async findAll(@Req() request: RequestWithUser) {
    const userRole = request.user.role;
    if (userRole === 'Volunteer') {
      throw new HttpException('Unauthorized profile', HttpStatus.UNAUTHORIZED);
    }
    return await this.profilesService.findAll();
  }

  @Get()
  async findOne(@Req() request: RequestWithUser) {
    const userRole = request.user.role;
    const userToGet = await this.usersService.findOneById(request.user.id);
    if (userToGet.id !== request.user.id && userRole === 'Volunteer') {
      throw new HttpException('Unauthorized profile', HttpStatus.UNAUTHORIZED);
    }
    return await this.profilesService.findOne(request.user.id);
  }

  @Patch()
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
