import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskEventDto } from './dto/create-task-event.dto';
import { UpdateTaskEventDto } from './dto/update-task-event.dto';

@Injectable()
export class TaskEventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTaskEventDto: CreateTaskEventDto) {
    return await this.prismaService.taskEvent.create({
      data: createTaskEventDto,
    });
  }

  async findAll() {
    return await this.prismaService.taskEvent.findMany();
  }

  async findAllWithRelations() {
    return await this.prismaService.taskEvent.findMany({
      include: {
        task: true,
        event: true,
      },
    });
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

  async findOneWithRelations(taskId: string, eventId: string) {
    return await this.prismaService.taskEvent.findUnique({
      where: {
        taskId_eventId: {
          taskId: +taskId,
          eventId: +eventId,
        },
      },
      include: {
        task: true,
        event: true,
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

  async remove(taskId: string, eventId: string) {
    return await this.prismaService.taskEvent.delete({
      where: {
        taskId_eventId: {
          taskId: +taskId,
          eventId: +eventId,
        },
      },
    });
  }

  async findByEventId(eventId: string) {
    return await this.prismaService.taskEvent.findMany({
      where: {
        eventId: +eventId,
      },
    });
  }

  async findByEventIdWithRelations(eventId: string) {
    return await this.prismaService.taskEvent.findMany({
      where: {
        eventId: +eventId,
      },
      include: {
        task: true,
      },
    });
  }

  async findByTaskId(taskId: string) {
    return await this.prismaService.taskEvent.findMany({
      where: {
        taskId: +taskId,
      },
    });
  }

  async findByTaskIdWithRelations(taskId: string) {
    return await this.prismaService.taskEvent.findMany({
      where: {
        taskId: +taskId,
      },
      include: {
        event: true,
      },
    });
  }
}
