import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateTaskEventDto } from './dto/create-task-event.dto';
import { UpdateTaskEventDto } from './dto/update-task-event.dto';
import { TaskEventsService } from './task-events.service';

@ApiTags('Tâches-Événements')
@UseGuards(AuthGuard)
@Controller('task-events')
export class TaskEventsController {
  constructor(private readonly taskEventsService: TaskEventsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer une association tâche-événement',
    description:
      'Associe une tâche à un événement avec le nombre de bénévoles nécessaires',
  })
  @ApiBody({ type: CreateTaskEventDto })
  @ApiResponse({
    status: 201,
    description: 'Association tâche-événement créée avec succès',
  })
  create(@Body() createTaskEventDto: CreateTaskEventDto) {
    return this.taskEventsService.create(createTaskEventDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer toutes les associations tâche-événement',
    description:
      'Retourne la liste de toutes les associations entre tâches et événements',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des associations retournée avec succès',
  })
  findAll() {
    return this.taskEventsService.findAll();
  }

  @Get(':taskId/:eventId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer une association tâche-événement',
    description:
      "Retourne les détails d'une association spécifique entre une tâche et un événement",
  })
  @ApiParam({ name: 'taskId', description: 'ID de la tâche' })
  @ApiParam({ name: 'eventId', description: "ID de l'événement" })
  @ApiResponse({ status: 200, description: 'Association trouvée' })
  @ApiResponse({ status: 404, description: 'Association non trouvée' })
  async findOneById(
    @Param('taskId') taskId: string,
    @Param('eventId') eventId: string,
  ) {
    return await this.taskEventsService.findOne(taskId, eventId);
  }

  @Patch(':taskId/:eventId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour une association tâche-événement',
    description:
      "Met à jour les détails d'une association entre une tâche et un événement",
  })
  @ApiParam({ name: 'taskId', description: 'ID de la tâche' })
  @ApiParam({ name: 'eventId', description: "ID de l'événement" })
  @ApiBody({ type: UpdateTaskEventDto })
  @ApiResponse({
    status: 200,
    description: 'Association mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Association non trouvée' })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Supprimer une association tâche-événement',
    description: 'Supprime une association entre une tâche et un événement',
  })
  @ApiParam({ name: 'id', description: "ID de l'association à supprimer" })
  @ApiResponse({
    status: 200,
    description: 'Association supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Association non trouvée' })
  remove(@Param('id') id: string) {
    return this.taskEventsService.remove(+id);
  }
}
