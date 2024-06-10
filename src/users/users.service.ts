import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  readonly includeDefault = {
    profile: true,
    userTaskEvent: {
      select: {
        status: true,
        task: { select: { id: true, name: true } },
        event: {
          select: { id: true, title: true, startDate: true, endDate: true },
        },
      },
    },
    userNotification: {
      select: {
        notification: true,
      },
    },
    userBadge: {
      select: {
        task: { select: { skillName: true, skillBadgePath: true } },
        level: true,
      },
    },
  };
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prismaService.user.create({ data: createUserDto });
  }
  async findAll() {
    return await this.prismaService.user.findMany({
      include: this.includeDefault,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async findOneById(id: string) {
    return await this.prismaService.user.findUnique({
      where: { id },
      include: this.includeDefault,
    });
  }

  async findOneByResetPassToken(resetPassToken: string) {
    return await this.prismaService.user.findFirst({
      where: { resetPassToken: resetPassToken },
    });
  }

  async findOneByConfirmToken(confirmToken: string) {
    return await this.prismaService.user.findFirst({
      where: { confirmToken },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.user.delete({ where: { id } });
  }
}
