import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserBadgeDto {
  @ApiProperty({
    description: "ID de l'utilisateur qui reçoit le badge",
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "ID du badge attribué à l'utilisateur",
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  badgeId: number;

  @ApiProperty({
    description: "Date d'attribution du badge",
    example: '2024-01-15T10:30:00Z',
    type: String,
  })
  @IsNotEmpty()
  awardedAt: string;
}
