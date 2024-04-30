import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private Task: Task[] = []
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTaskDto: CreateTaskDto):Promise<Task> {
    return await this.create(createTaskDto);
  }

  insertInStudents(task : Task):void{
    this.Task.push(task);
}
  async findAll(): Promise<Task> {
    return await this.findAll();
  }


  async findOne(id: number): Promise<Task> {
    return await this.Task.find((task) => task?.id == id);
  }
//   findOne(id: number): Student {
//     return this.students.find((student) => student?.id === id)
// }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
