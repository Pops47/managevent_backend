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
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/utils/interfaces/request';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: RequestWithUser) {
    if (request.user.role === 'Volunteer' && request.user.id !== id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.usersService.findOneById(id);
  }

  @Get()
  async findOneByToken(@Req() request: RequestWithUser) {
    return await this.usersService.findOneById(request.user.id);
  }

  @Get('/token/:token')
  findOneByResetPassToken(@Param('token') token: string) {
    console.log(
      '🚀 ~ UsersController ~ findOneByResetPassToken ~ token:',
      token,
    );
    return this.usersService.findOneByResetPassToken(token);
  }

  @Patch()
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
