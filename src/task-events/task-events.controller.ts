import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TaskEventsService } from './task-events.service';
import { CreateTaskEventDto } from './dto/create-task-event.dto';
import { UpdateTaskEventDto } from './dto/update-task-event.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('task-events')
export class TaskEventsController {
  constructor(private readonly taskEventsService: TaskEventsService) {}

  @Post()
  create(@Body() createTaskEventDto: CreateTaskEventDto) {
    return this.taskEventsService.create(createTaskEventDto);
  }

  @Get()
  findAll() {
    return this.taskEventsService.findAll();
  }

  @Get(':taskId/:eventId')
  async findOneById(
    @Param('taskId') taskId: string,
    @Param('eventId') eventId: string,
  ) {
    return await this.taskEventsService.findOne(taskId, eventId);
  }

  @Patch(':taskId/:eventId')
  async update(
    @Param('taskId') taskId: string,
    @Param('eventId') eventId: string,
    @Body() updateTaskEventDto: UpdateTaskEventDto,
  ) {
    return await this.taskEventsService.update(
      taskId,
      eventId,
      updateTaskEventDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskEventsService.remove(+id);
  }
}
