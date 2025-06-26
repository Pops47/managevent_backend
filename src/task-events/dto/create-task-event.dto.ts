import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskEventDto {
  @ApiProperty({
    description: "ID de la tâche associée à l'événement",
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  taskId: number;

  @ApiProperty({
    description: "ID de l'événement associé à la tâche",
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  eventId: number;

  @ApiProperty({
    description: 'Nombre de bénévoles nécessaires pour cette tâche',
    example: 5,
    type: Number,
  })
  @IsNotEmpty()
  volunteerNumber: number;

  @ApiProperty({
    description: 'Indique si la validation est nécessaire pour cette tâche',
    example: true,
    type: Boolean,
  })
  @IsNotEmpty()
  needValidation: boolean;
}
