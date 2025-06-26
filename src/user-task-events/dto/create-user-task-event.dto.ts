import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserTaskEventDto {
  @ApiProperty({
    description: "ID de l'utilisateur qui s'inscrit à la tâche",
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "ID de la tâche à laquelle l'utilisateur s'inscrit",
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
}
