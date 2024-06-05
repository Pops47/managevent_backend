import { Task } from "@prisma/client"



export const prismaMock = {
    task: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        create: jest.fn()
    }


}

export const mockTask: Task = {
    id: 1,
    name: 'test task',
    description: 'test description task',
    skillName: 'test skill',
    skillBadgePath: 'test/path/of/badge',
    createdAt: new Date(),
    updatedAt: new Date()
}

export const mockTaskCreation = {
    name: 'test task',
    description: 'test description task',
    skillName: 'test skill',
    skillBadgePath: 'test/path/of/badge',
}