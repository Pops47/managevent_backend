import { PartialType } from '@nestjs/swagger';
import { RoleEnum, UserStatusEnum } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  refreshToken?: string;

  @IsOptional()
  role?: RoleEnum;

  @IsOptional()
  resetPassToken?: string;

  @IsOptional()
  status?: UserStatusEnum;
}
