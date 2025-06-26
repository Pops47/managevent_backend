import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une nouvelle notification',
    description: 'Crée une nouvelle notification',
  })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({ status: 201, description: 'Notification créée avec succès' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer toutes les notifications',
    description: 'Retourne la liste de toutes les notifications',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des notifications retournée avec succès',
  })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une notification par ID',
    description: "Retourne les détails d'une notification spécifique",
  })
  @ApiParam({ name: 'id', description: 'ID de la notification' })
  @ApiResponse({ status: 200, description: 'Notification trouvée' })
  @ApiResponse({ status: 404, description: 'Notification non trouvée' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour une notification',
    description: 'Met à jour une notification existante',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la notification à mettre à jour',
  })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiResponse({
    status: 200,
    description: 'Notification mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Notification non trouvée' })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer une notification',
    description: 'Supprime une notification',
  })
  @ApiParam({ name: 'id', description: 'ID de la notification à supprimer' })
  @ApiResponse({
    status: 200,
    description: 'Notification supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Notification non trouvée' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
