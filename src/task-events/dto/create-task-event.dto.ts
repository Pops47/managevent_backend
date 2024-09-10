import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTaskEventDto {
  @ApiProperty()
  @IsNotEmpty()
  taskId: number;
  @IsNotEmpty()
  eventId: number;
  @IsNotEmpty()
  volunteerNumber: number;
  @IsNotEmpty()
  needValidation: boolean;
}
