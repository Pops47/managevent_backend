import { PartialType } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  //creer une fonction qui permet d'envoyer des données à chaques itérations de la fonction.
  private Task: Task[] = [
    { "id": 1, "name": "Loremone", "description": "one Dolor sit amet" },
    { "id": 2, "name": "Loremtwo", "description": "two Dolor sit amet" },
    { "id": 3, "name": "Loremthree", "description": "Three Dolor sit amet" },
    { "id": 4, "name": "Loremfour", "description": "Four Dolor sit amet" },
    { "id": 5, "name": "Loremfive", "description": "five Dolor sit amet" },
  ]

  constructor(private readonly prismaService: PrismaService) { }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return new Task(createTaskDto)
  }

  insertInTask(task: Task): void {
    this.Task.push(task);
  }

  async findAll(): Promise<Task[]> {
    return this.Task
  }
  //this.Task();

  async findOne(id: number): Promise<Task> {
    return await this.Task.find((task) => task?.id == id);

  }


  findIndex(id: number): number {
    return this.Task.findIndex((e: Task) => e.id === id)
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {

    const updateTask = await this.Task.findIndex((e: Task) => e?.id == id)

    this.Task[updateTask] = { ...this.Task[updateTask], ...updateTaskDto }

    return this.Task[updateTask]
  }




  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}

