import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../../prisma/prisma.service';
import { mockTask, mockTaskCreation, prismaMock } from '../../test/utils/mock';
import { Task } from '@prisma/client';

describe('TasksService', () => {

  let taskService: TasksService;
  let findUniqueMock: jest.Mock;


  beforeEach(async () => {

    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: prismaMock
        }
      ]
    }).compile()

    taskService = await module.get(TasksService)

    prismaMock.task.findUnique.mockClear();
    prismaMock.task.findMany.mockClear();
    prismaMock.task.create.mockClear();
    prismaMock.task.update.mockClear();
    prismaMock.task.delete.mockClear();
  })

  // FindOne
  describe('When the findOne method is called', () => {

    describe('And the findUnique method return the task', () => {

      let task: Task;
      beforeEach(() => {
        task = mockTask
        prismaMock.task.findUnique.mockResolvedValue(task);
      })


      it('Should return the task', async () => {
        const result = await taskService.findOne(task.id)
        expect(result).toBe(task);
        expect(prismaMock.task.findUnique).toHaveBeenCalledTimes(1);
        expect(prismaMock.task.findUnique).toHaveBeenCalledWith({ where: { id: task.id } })
      })

      it('Should return null if task id not exists', async () => {

        prismaMock.task.findUnique.mockResolvedValue(null);
        const result = await taskService.findOne(-1);
        expect(result).toBe(null);
        expect(prismaMock.task.findUnique).toHaveBeenCalledTimes(1);
        expect(prismaMock.task.findUnique).toHaveBeenCalledWith({ where: { id: -1 } })
      })
    })

  })


  // Create
  describe('when the create function is called', () => {

    describe('ans the create method return a new task', () => {

      it('should return the task', async () => {
        const task = mockTask
        prismaMock.task.create.mockResolvedValue(task);
        const result = await taskService.create(mockTaskCreation)
        expect(result).toBe(task);
        expect(prismaMock.task.create).toHaveBeenCalledTimes(1);
        expect(prismaMock.task.create).toHaveBeenCalledWith({
          data: mockTaskCreation,
        });
      })

      it('Should return {} if task data is null', async () => {
        prismaMock.task.create.mockResolvedValue({});
        const result = await taskService.create(null);
        expect(result).toStrictEqual({})
        expect(prismaMock.task.create).toHaveBeenCalledTimes(1);
        expect(prismaMock.task.create).toHaveBeenCalledWith({
          data: null,
        });
      })

    })

  })


});
