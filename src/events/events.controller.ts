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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Event } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/utils/interfaces/request';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@ApiTags('Événements')
@UseGuards(AuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer un nouvel événement',
    description: 'Crée un nouvel événement (Admin et SuperAdmin uniquement)',
  })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Événement créé avec succès' })
  @ApiResponse({
    status: 401,
    description: "Non autorisé - Bénévoles ne peuvent pas créer d'événements",
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer tous les événements',
    description: 'Retourne la liste de tous les événements',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des événements retournée avec succès',
  })
  async findAll(): Promise<Event[]> {
    return await this.eventsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer un événement par ID',
    description: "Retourne les détails d'un événement spécifique",
  })
  @ApiParam({ name: 'id', description: "ID de l'événement" })
  @ApiResponse({ status: 200, description: 'Événement trouvé' })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
  async findOne(@Param('id') id: string): Promise<Event> {
    return await this.eventsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour un événement',
    description:
      'Met à jour un événement existant (Admin et SuperAdmin uniquement)',
  })
  @ApiParam({ name: 'id', description: "ID de l'événement à mettre à jour" })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: 'Événement mis à jour avec succès' })
  @ApiResponse({
    status: 401,
    description:
      "Non autorisé - Bénévoles ne peuvent pas modifier d'événements",
  })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Supprimer un événement',
    description: 'Supprime un événement (Admin et SuperAdmin uniquement)',
  })
  @ApiParam({ name: 'id', description: "ID de l'événement à supprimer" })
  @ApiResponse({ status: 200, description: 'Événement supprimé avec succès' })
  @ApiResponse({
    status: 401,
    description:
      "Non autorisé - Bénévoles ne peuvent pas supprimer d'événements",
  })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
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
