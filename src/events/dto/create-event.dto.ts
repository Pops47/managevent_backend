import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: "Titre de l'événement",
    example: 'Festival de musique 2024',
    type: String,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Description détaillée de l'événement",
    example:
      'Un grand festival de musique en plein air avec plusieurs artistes',
    type: String,
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "Adresse de l'événement",
    example: '123 Rue de la Paix, 75001 Paris',
    type: String,
  })
  @IsNotEmpty()
  adress: string;

  @ApiProperty({
    description: "Date et heure de début de l'événement",
    example: '2024-07-15T18:00:00Z',
    type: String,
  })
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: "Date et heure de fin de l'événement",
    example: '2024-07-15T23:00:00Z',
    type: String,
  })
  @IsNotEmpty()
  endDate: string;
}
