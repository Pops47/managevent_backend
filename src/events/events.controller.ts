import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Event } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/utils/interfaces/request';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@UseGuards(AuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(
    @Req() request: RequestWithUser,
    @Body() createEventDto: CreateEventDto,
  ): Promise<Event> {
    const userRole = request.user.role;
    if (userRole === 'Volunteer') {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.eventsService.create(createEventDto);
  }

  @Get()
  async findAll(): Promise<Event[]> {
    return await this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event> {
    return await this.eventsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const userRole = request.user.role;
    if (userRole === 'Volunteer') {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
  ): Promise<Event> {
    const userRole = request.user.role;
    if (userRole === 'Volunteer') {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.eventsService.remove(+id);
  }
}
