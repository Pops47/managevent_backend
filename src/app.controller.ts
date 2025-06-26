import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Application')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: 'Message de bienvenue',
    description: "Retourne un message de bienvenue pour l'API Manag'Event",
  })
  @ApiResponse({
    status: 200,
    description: 'Message de bienvenue retourné avec succès',
  })
  getWelcomeMessage(): { message: string } {
    return {
      message: "Bienvenue sur l'API Manag'Event ! 🎉",
    };
  }
}
