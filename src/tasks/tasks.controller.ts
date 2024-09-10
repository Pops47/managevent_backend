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
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

import { Task } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/utils/interfaces/request';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Req() request: RequestWithUser,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const userRole = request.user.role;
    if (userRole === 'Volunteer') {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return await this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const userRole = request.user.role;
    if (userRole === 'Volunteer') {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: RequestWithUser) {
    const userRole = request.user.role;
    if (userRole === 'Volunteer') {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.tasksService.remove(+id);
  }
}
