import { TaskEvent } from './../../task-events/entities/task-event.entity';
import { IsNotEmpty, IsString} from "class-validator"

export class CreateEventDto {

    @IsNotEmpty()
    @IsString()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    adress: string

    @IsString()
    @IsNotEmpty()
    startDate: string

    @IsString()
    @IsNotEmpty()
    endDate: string

}
