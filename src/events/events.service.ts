import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from '@prisma/client';

@Injectable()
export class EventsService {
  readonly includeDefault = {
    taskEvent: {
      select: {
        taskId: true,
        volunteerNumber: true,
        needValidation: true,
      },
    },
    userTaskEvent: {
      select: {
        userId: true,
        status: true,
      },
    },
  };

  constructor(private readonly prismaService: PrismaService) { }

  async create(createEventDto: CreateEventDto) {
    return await this.prismaService.event.create({
      data:
        createEventDto
    });
  }

  async findAll(): Promise<Array<Event>> {
    return await this.prismaService.event.findMany()
  }


  async findOne(id: number): Promise<Event> {
    return await this.prismaService.event.findUnique({
      where: {
        id,
        title: 'vieilles charrues',
      },
      include: this.includeDefault,
    });
  }
  //  async machine(argent: number): Promise<bonbon> {}
  update(id: number, updateEventDto: UpdateEventDto) {
    return this.prismaService.event.update({
      data: updateEventDto,
      where: {id}
    });
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
