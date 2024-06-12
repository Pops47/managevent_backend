import { IsNotEmpty } from 'class-validator';

export class CreateUserTaskEventDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  taskId: number;

  @IsNotEmpty()
  eventId: number;
}
