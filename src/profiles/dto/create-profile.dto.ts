import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    description: "ID de l'utilisateur associé au profil",
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: 'Jean',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({
    description: "Nom de famille de l'utilisateur",
    example: 'Dupont',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    description: "Surnom ou nom d'utilisateur",
    example: 'JeanD',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty({
    description: "Chemin vers l'avatar de l'utilisateur",
    example: '/avatars/user123.jpg',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  avatarPath?: string;
}
