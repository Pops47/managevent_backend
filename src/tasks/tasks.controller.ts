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

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Task } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/utils/interfaces/request';

@ApiTags('Tâches')
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer une nouvelle tâche',
    description: 'Crée une nouvelle tâche (Admin et SuperAdmin uniquement)',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Tâche créée avec succès' })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé - Bénévoles ne peuvent pas créer de tâches',
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer toutes les tâches',
    description: 'Retourne la liste de toutes les tâches',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des tâches retournée avec succès',
  })
  async findAll(): Promise<Task[]> {
    return await this.tasksService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer une tâche par ID',
    description: "Retourne les détails d'une tâche spécifique",
  })
  @ApiParam({ name: 'id', description: 'ID de la tâche' })
  @ApiResponse({ status: 200, description: 'Tâche trouvée' })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  async findOne(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour une tâche',
    description:
      'Met à jour une tâche existante (Admin et SuperAdmin uniquement)',
  })
  @ApiParam({ name: 'id', description: 'ID de la tâche à mettre à jour' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Tâche mise à jour avec succès' })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé - Bénévoles ne peuvent pas modifier de tâches',
  })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Supprimer une tâche',
    description: 'Supprime une tâche (Admin et SuperAdmin uniquement)',
  })
  @ApiParam({ name: 'id', description: 'ID de la tâche à supprimer' })
  @ApiResponse({ status: 200, description: 'Tâche supprimée avec succès' })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé - Bénévoles ne peuvent pas supprimer de tâches',
  })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  async remove(@Param('id') id: string, @Req() request: RequestWithUser) {
    const userRole = request.user.role;
    if (userRole === 'Volunteer') {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.tasksService.remove(+id);
  }
}
