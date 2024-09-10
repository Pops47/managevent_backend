import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
