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
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto';
import { UserNotificationsService } from './user-notifications.service';

@ApiTags('Utilisateurs-Notifications')
@Controller('user-notifications')
export class UserNotificationsController {
  constructor(
    private readonly userNotificationsService: UserNotificationsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Créer une association utilisateur-notification',
    description: 'Associe une notification à un utilisateur',
  })
  @ApiBody({ type: CreateUserNotificationDto })
  @ApiResponse({
    status: 201,
    description: 'Association utilisateur-notification créée avec succès',
  })
  create(@Body() createUserNotificationDto: CreateUserNotificationDto) {
    return this.userNotificationsService.create(createUserNotificationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer toutes les associations utilisateur-notification',
    description:
      'Retourne la liste de toutes les associations entre utilisateurs et notifications',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des associations retournée avec succès',
  })
  findAll() {
    return this.userNotificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une association utilisateur-notification',
    description:
      "Retourne les détails d'une association spécifique entre un utilisateur et une notification",
  })
  @ApiParam({ name: 'id', description: "ID de l'association" })
  @ApiResponse({ status: 200, description: 'Association trouvée' })
  @ApiResponse({ status: 404, description: 'Association non trouvée' })
  findOne(@Param('id') id: string) {
    return this.userNotificationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour une association utilisateur-notification',
    description:
      "Met à jour les détails d'une association entre un utilisateur et une notification",
  })
  @ApiParam({ name: 'id', description: "ID de l'association à mettre à jour" })
  @ApiBody({ type: UpdateUserNotificationDto })
  @ApiResponse({
    status: 200,
    description: 'Association mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Association non trouvée' })
  update(
    @Param('id') id: string,
    @Body() updateUserNotificationDto: UpdateUserNotificationDto,
  ) {
    return this.userNotificationsService.update(+id, updateUserNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer une association utilisateur-notification',
    description:
      'Supprime une association entre un utilisateur et une notification',
  })
  @ApiParam({ name: 'id', description: "ID de l'association à supprimer" })
  @ApiResponse({
    status: 200,
    description: 'Association supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Association non trouvée' })
  remove(@Param('id') id: string) {
    return this.userNotificationsService.remove(+id);
  }
}
