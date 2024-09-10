import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserTaskEventDto } from './dto/create-user-task-event.dto';
import { UpdateUserTaskEventDto } from './dto/update-user-task-event.dto';

@Injectable()
export class UserTaskEventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserTaskEventDto: CreateUserTaskEventDto) {
    return await this.prismaService.userTaskEvent.create({
      data: createUserTaskEventDto,
    });
  }

  findAll() {
    return `This action returns all userTaskEvents`;
  }

  findOne(id: number) {
    return 'findOne';
  }

  async remove(taskId: string, eventId: string, userId: string) {
    return await this.prismaService.userTaskEvent.delete({
      where: {
        userId_taskId_eventId: {
          taskId: +taskId,
          eventId: +eventId,
          userId,
        },
      },
    });
  }
}
