import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { JwtService } from '@nestjs/jwt';
import { mockTask } from '../../test/utils/mock';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTaskService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{
        provide: TasksService,
        useValue: mockTaskService
      }, JwtService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findOne => should find a task by a given id ans return it\'s data', async () => {

    const task = mockTask;
    jest.spyOn(mockTaskService, 'findOne').mockReturnValue(task);

    const result = await controller.findOne(task.id.toString())

    expect(result).toEqual(task);
    expect(mockTaskService.findOne).toHaveBeenCalledTimes(1);
    expect(mockTaskService.findOne).toHaveBeenCalledWith(task.id)
  })

});
