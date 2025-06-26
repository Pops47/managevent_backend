import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CreateUserTaskEventDto } from './dto/create-user-task-event.dto';
import { UserTaskEventsService } from './user-task-events.service';

@ApiTags('Utilisateurs-Tâches-Événements')
@UseGuards(AuthGuard)
@Controller('user-task-events')
export class UserTaskEventsController {
  constructor(private readonly userTaskEventsService: UserTaskEventsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Inscrire un utilisateur à une tâche',
    description: "Associe un utilisateur à une tâche spécifique d'un événement",
  })
  @ApiBody({ type: CreateUserTaskEventDto })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur inscrit à la tâche avec succès',
  })
  async create(@Body() createUserTaskEventDto: CreateUserTaskEventDto) {
    return await this.userTaskEventsService.create(createUserTaskEventDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer toutes les inscriptions',
    description:
      "Retourne la liste de toutes les inscriptions d'utilisateurs aux tâches",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des inscriptions retournée avec succès',
  })
  findAll() {
    return this.userTaskEventsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer une inscription par ID',
    description: "Retourne les détails d'une inscription spécifique",
  })
  @ApiParam({ name: 'id', description: "ID de l'inscription" })
  @ApiResponse({ status: 200, description: 'Inscription trouvée' })
  @ApiResponse({ status: 404, description: 'Inscription non trouvée' })
  findOne(@Param('id') id: string) {
    return this.userTaskEventsService.findOne(+id);
  }

  @Delete(':taskId/:eventId/:userId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Désinscrire un utilisateur d'une tâche",
    description:
      "Supprime l'inscription d'un utilisateur à une tâche spécifique",
  })
  @ApiParam({ name: 'taskId', description: 'ID de la tâche' })
  @ApiParam({ name: 'eventId', description: "ID de l'événement" })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur désinscrit avec succès',
  })
  @ApiResponse({ status: 404, description: 'Inscription non trouvée' })
  async remove(
    @Param('taskId') taskId: string,
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    return await this.userTaskEventsService.remove(taskId, eventId, userId);
  }
}
