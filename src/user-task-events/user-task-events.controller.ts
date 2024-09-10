import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserTaskEventsService } from './user-task-events.service';
import { CreateUserTaskEventDto } from './dto/create-user-task-event.dto';
import { UpdateUserTaskEventDto } from './dto/update-user-task-event.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('user-task-events')
export class UserTaskEventsController {
  constructor(private readonly userTaskEventsService: UserTaskEventsService) {}

  @Post()
  async create(@Body() createUserTaskEventDto: CreateUserTaskEventDto) {
    return await this.userTaskEventsService.create(createUserTaskEventDto);
  }

  @Get()
  findAll() {
    return this.userTaskEventsService.findAll();
  }

  @Get()
  findOne(id: string) {
    return this.userTaskEventsService.findOne(+id);
  }

  @Delete(':taskId/:eventId/:userId')
  async remove(
    @Param('taskId') taskId: string,
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    return await this.userTaskEventsService.remove(taskId, eventId, userId);
  }
}
