import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { CreateTaskDto } from "../dto/create-task.dto";

export class Task {
    static countTask = 5;

    constructor(createTaskDto : CreateTaskDto){
        Task.countTask ++
        this.id = Task.countTask
        this.name= createTaskDto.name;
        this.description = createTaskDto.description;
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;
}
