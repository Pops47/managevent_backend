import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserNotificationDto {
  @ApiProperty({
    description: "ID de l'utilisateur qui reçoit la notification",
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "ID de la notification associée à l'utilisateur",
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  notificationId: number;

  @ApiProperty({
    description: "Indique si la notification a été lue par l'utilisateur",
    example: false,
    type: Boolean,
    default: false,
  })
  @IsNotEmpty()
  isRead: boolean;
}
