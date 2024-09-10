import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfilesService {
  /* readonly includeDefault = {
     user: {
      select: {
        email: true,
        lastConnexion: true 
      }
     }
   }*/

  constructor(private readonly prismaService: PrismaService) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    return await this.prismaService.profile.create({
      data: createProfileDto,
    });
  }

  async findAll(): Promise<Profile[]> {
    return await this.prismaService.profile.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string): Promise<Profile> {
    return await this.prismaService.profile.findUnique({
      where: { userId },
    });
  }

  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.prismaService.profile.update({
      where: { userId },
      data: updateProfileDto,
    });
  }

  async remove(userId: string): Promise<Profile> {
    return await this.prismaService.profile.delete({ where: { userId } });
  }
}
