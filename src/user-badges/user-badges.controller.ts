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
import { CreateUserBadgeDto } from './dto/create-user-badge.dto';
import { UpdateUserBadgeDto } from './dto/update-user-badge.dto';
import { UserBadgesService } from './user-badges.service';

@ApiTags('Utilisateurs-Badges')
@Controller('user-badges')
export class UserBadgesController {
  constructor(private readonly userBadgesService: UserBadgesService) {}

  @Post()
  @ApiOperation({
    summary: 'Attribuer un badge à un utilisateur',
    description: "Associe un badge à un utilisateur avec la date d'attribution",
  })
  @ApiBody({ type: CreateUserBadgeDto })
  @ApiResponse({ status: 201, description: 'Badge attribué avec succès' })
  create(@Body() createUserBadgeDto: CreateUserBadgeDto) {
    return this.userBadgesService.create(createUserBadgeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer toutes les attributions de badges',
    description:
      'Retourne la liste de toutes les associations entre utilisateurs et badges',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des attributions retournée avec succès',
  })
  findAll() {
    return this.userBadgesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer une attribution de badge',
    description:
      "Retourne les détails d'une attribution spécifique entre un utilisateur et un badge",
  })
  @ApiParam({ name: 'id', description: "ID de l'attribution" })
  @ApiResponse({ status: 200, description: 'Attribution trouvée' })
  @ApiResponse({ status: 404, description: 'Attribution non trouvée' })
  findOne(@Param('id') id: string) {
    return this.userBadgesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour une attribution de badge',
    description:
      "Met à jour les détails d'une attribution entre un utilisateur et un badge",
  })
  @ApiParam({ name: 'id', description: "ID de l'attribution à mettre à jour" })
  @ApiBody({ type: UpdateUserBadgeDto })
  @ApiResponse({
    status: 200,
    description: 'Attribution mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Attribution non trouvée' })
  update(
    @Param('id') id: string,
    @Body() updateUserBadgeDto: UpdateUserBadgeDto,
  ) {
    return this.userBadgesService.update(+id, updateUserBadgeDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Supprimer une attribution de badge',
    description: 'Supprime une attribution entre un utilisateur et un badge',
  })
  @ApiParam({ name: 'id', description: "ID de l'attribution à supprimer" })
  @ApiResponse({
    status: 200,
    description: 'Attribution supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Attribution non trouvée' })
  remove(@Param('id') id: string) {
    return this.userBadgesService.remove(+id);
  }
}
