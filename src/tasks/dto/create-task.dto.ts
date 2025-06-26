import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Nom de la tâche',
    example: 'Accueil des visiteurs',
    type: String,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description détaillée de la tâche',
    example:
      "Accueillir les visiteurs à l'entrée de l'événement et les orienter",
    type: String,
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Nom de la compétence requise pour cette tâche',
    example: 'Communication',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  skillName?: string;

  @ApiProperty({
    description: 'Chemin vers le badge de compétence',
    example: '/badges/communication.png',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  skillBadgePath?: string;
}
