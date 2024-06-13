import { ProfilesModule } from './profiles.module';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from '@prisma/client';
import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';


// export class PaginatedOutputDto<ProfilesModule> {
//   data: ProfilesService[];
//   meta: {
//     total: number;
//     lastPage: number;
//     currentPage: number;
//     perPage: number;
//     prev: number | null;
//     next: number | null;
//   };
// }

@Injectable()
export class ProfilesService {
  readonly includeDefault = {
    user: {
      select: {
        userId: true,
      }
    }
  }
  profile: any;
  
  constructor(private readonly prismaService: PrismaService) { }

  // Faire un CRUD de Profiles, avec un findAll avec une pagination.
  async create(createProfileDto: CreateProfileDto) {
    return await this.prismaService.profile.create({
      data: createProfileDto,
    });
  }

  async findAll(skip: number, take: number): Promise<Profile[]> {
    if(skip | take) {
      skip
      take;
    } else {
      skip = 0,
      take = 5;
    }
    console.log('coucou')
    return await this.prismaService.profile.findMany({
      skip,
      take,
      orderBy: [
        {
          lastname: 'asc',
        },
      ],
    });
  }

  async findOne(userId: string): Promise<Profile> {
    return await this.prismaService.profile.findUnique({
      where: { userId },
    });
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    return await this.prismaService.profile.update({
      data: updateProfileDto,
      where: {userId}
    });
  }

  async remove(userId: string): Promise<Profile> {
    return await this.prismaService.profile.delete({
        where: {userId}
      }
    );
  }
}
