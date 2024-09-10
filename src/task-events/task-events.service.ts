import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskEventDto } from './dto/create-task-event.dto';
import { UpdateTaskEventDto } from './dto/update-task-event.dto';

@Injectable()
export class TaskEventsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createTaskEventDto: CreateTaskEventDto) {
    return 'This action adds a new taskEvent';
  }

  findAll() {
    return `This action returns all taskEvents`;
  }

  async findOne(taskId: string, eventId: string) {
    return await this.prismaService.taskEvent.findUnique({
      where: {
        taskId_eventId: {
          taskId: +taskId,
          eventId: +eventId,
        },
      },
    });
  }

  async update(
    taskId: string,
    eventId: string,
    updateTaskEventDto: UpdateTaskEventDto,
  ) {
    return await this.prismaService.taskEvent.update({
      where: {
        taskId_eventId: {
          taskId: +taskId,
          eventId: +eventId,
        },
      },
      data: updateTaskEventDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} taskEvent`;
  }
}
