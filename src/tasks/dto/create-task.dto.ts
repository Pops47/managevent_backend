import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateTaskDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  skillName?: string;

  @IsOptional()
  @IsNotEmpty()
  skillBadgePath?: string;
}
