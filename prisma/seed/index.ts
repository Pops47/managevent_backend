import { fakerFR as faker } from '@faker-js/faker';
import {
  Event,
  Notification,
  PrismaClient,
  Profile,
  RoleEnum,
  Task,
  TaskEvent,
  User,
  UserBadge,
  UserNotification,
  UserTaskEvent,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const createSuperAdminUser = async (): Promise<User> => {
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@mail.com',
      role: RoleEnum.SuperAdmin,
      refreshToken: faker.string.alpha(155),
      password: await bcrypt.hash('Azerty1234!', 10),
      status: 'Active',
    },
  });
  return superAdmin;
};
const createUsers = async (number: number): Promise<User[]> => {
  const users: User[] = [];
  while (number) {
    const userVolunteer = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        role: RoleEnum.Volunteer,
        refreshToken: faker.string.alpha(155),
        password: await bcrypt.hash('Azerty1234!', 10),
        status: 'Active',
      },
    });
    users.push(userVolunteer);
    number--;
  }
  return users;
};

const createUserProfiles = async (users: User[]): Promise<Profile[]> => {
  const usersProfil: Profile[] = [];
  let number = users.length - 1;
  while (number) {
    const userProfilVolunteer = await prisma.profile.create({
      data: {
        userId: users[number].id,
        firstname: faker.person.firstName().substring(0, 50),
        lastname: faker.person.lastName().substring(0, 50),
        nickname: faker.internet.userName().substring(0, 20),
        avatarPath: 'https://docs.material-tailwind.com/img/face-2.jpg',
      },
    });
    usersProfil.push(userProfilVolunteer);
    number--;
  }
  return usersProfil;
};

function dateAddDays(a: number, b?: string | Date) {
  const d = new Date(b || new Date());
  d.setDate(d.getDate() + a);
  return d;
}

const createEvents = async (number: number): Promise<Event[]> => {
  const events: Event[] = [];
  while (number) {
    const startDate = faker.date.future();
    const endDate = dateAddDays(1, startDate);
    const event = await prisma.event.create({
      data: {
        title: faker.word.words(2).substring(0, 30),
        description: faker.lorem.lines(5),
        adress: faker.location.streetAddress(),
        startDate: startDate,
        endDate: endDate,
      },
    });
    events.push(event);
    number--;
  }
  return events;
};

const createTasks = async (number: number): Promise<Task[]> => {
  const tasks: Task[] = [];
  while (tasks.length < number) {
    const taskName = faker.lorem.word();

    const task = await prisma.task.upsert({
      where: { name: taskName },
      update: {},
      create: {
        name: taskName,
        description: faker.lorem.lines(5),
        skillName: faker.person.jobTitle().substring(0, 30),
      },
    });

    tasks.push(task);
  }

  return tasks;
};

const createNotifications = async (number: number): Promise<Notification[]> => {
  const notifications: Notification[] = [];
  while (number) {
    const notification = await prisma.notification.create({
      data: {
        content: faker.lorem.lines(1).substring(0, 100),
      },
    });
    notifications.push(notification);
    number--;
  }
  return notifications;
};

const createTaskEvents = async (
  tasks: Task[],
  events: Event[],
  number: number,
): Promise<TaskEvent[]> => {
  const taskEvents: TaskEvent[] = [];

  function isNewTaskEvent(
    taskIndex: number,
    eventIndex: number,
    taskEvents: TaskEvent[],
  ): boolean {
    for (const taskEvent of taskEvents) {
      if (
        tasks[taskIndex].id === taskEvent.taskId &&
        events[eventIndex].id === taskEvent.eventId
      ) {
        return false;
      }
    }
    return true;
  }

  const maxTaskEvents = tasks.length * events.length;

  while (number) {
    if (taskEvents.length === maxTaskEvents) return taskEvents;

    const taskIndex = Math.floor(Math.random() * tasks.length);
    const eventIndex = Math.floor(Math.random() * events.length);
    if (isNewTaskEvent(taskIndex, eventIndex, taskEvents)) {
      const taskEvent = await prisma.taskEvent.create({
        data: {
          taskId: tasks[taskIndex].id,
          eventId: events[eventIndex].id,
          volunteerNumber: faker.number.int(10),
        },
      });
      taskEvents.push(taskEvent);
      number--;
    }
  }
  return taskEvents;
};

const createUserTaskEvents = async (
  taskEvents: TaskEvent[],
  users: User[],
  number: number,
): Promise<UserTaskEvent[]> => {
  const userTaskEvents: UserTaskEvent[] = [];

  function isNewUserTaskEvent(
    taskIndex: number,
    eventIndex: number,
    userIndex: string,
    userTaskEvents: UserTaskEvent[],
  ): boolean {
    for (const userTaskEvent of userTaskEvents) {
      if (
        taskIndex === userTaskEvent.taskId &&
        eventIndex === userTaskEvent.eventId &&
        userIndex === userTaskEvent.userId
      ) {
        return false;
      }
    }
    return true;
  }

  function isTaskEventComplete(taskId: number, eventId: number): boolean {
    const currentTaskEvent = taskEvents.find(
      (taskEvent) =>
        taskEvent.taskId === taskId && taskEvent.eventId === eventId,
    );
    const currentVolunteerNumber = userTaskEvents.reduce((acc, curr) => {
      if (curr.taskId === taskId && curr.eventId === eventId) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
    if (currentVolunteerNumber >= currentTaskEvent.volunteerNumber) return true;
    return false;
  }

  function countCompleteTaskEvents(): number {
    let count = 0;
    for (const taskEvent of taskEvents) {
      if (isTaskEventComplete(taskEvent.taskId, taskEvent.eventId)) {
        count++;
      }
    }
    return count;
  }

  while (number) {
    if (countCompleteTaskEvents() === taskEvents.length) {
      return userTaskEvents;
    }
    const userIndex = Math.floor(Math.random() * users.length);
    const taskEventIndex = Math.floor(Math.random() * taskEvents.length);
    if (
      isNewUserTaskEvent(
        taskEvents[taskEventIndex].taskId,
        taskEvents[taskEventIndex].eventId,
        users[userIndex].id,
        userTaskEvents,
      ) &&
      !isTaskEventComplete(
        taskEvents[taskEventIndex].taskId,
        taskEvents[taskEventIndex].eventId,
      )
    ) {
      const userTaskEvent = await prisma.userTaskEvent.create({
        data: {
          taskId: taskEvents[taskEventIndex].taskId,
          eventId: taskEvents[taskEventIndex].eventId,
          userId: users[userIndex].id,
        },
      });
      userTaskEvents.push(userTaskEvent);
      number--;
    }
  }
  return userTaskEvents;
};

const createUserBadges = async (
  users: User[],
  tasks: Task[],
  number: number,
): Promise<UserBadge[]> => {
  const userBadges: UserBadge[] = [];

  function isNewUserBadge(
    userIndex: number,
    taskIndex: number,
    userBadges: UserBadge[],
  ): boolean {
    for (const userBadge of userBadges) {
      if (
        users[userIndex].id === userBadge.userId &&
        tasks[taskIndex].id === userBadge.taskId
      ) {
        return false;
      }
    }
    return true;
  }

  const maxUserBadges = users.length * tasks.length;

  while (number) {
    if (userBadges.length === maxUserBadges) return userBadges;

    const userIndex = Math.floor(Math.random() * users.length);
    const taskIndex = Math.floor(Math.random() * tasks.length);

    if (isNewUserBadge(userIndex, taskIndex, userBadges)) {
      const userBadge = await prisma.userBadge.create({
        data: {
          userId: users[userIndex].id,
          taskId: tasks[taskIndex].id,
          level: faker.number.int(5),
        },
      });
      userBadges.push(userBadge);
      number--;
    }
  }
  return userBadges;
};

const createUserNotifications = async (
  users: User[],
  notifications: Notification[],
  number: number,
): Promise<UserNotification[]> => {
  const userNotifications: UserNotification[] = [];

  function isNewUserNotification(
    userIndex: number,
    notificationIndex: number,
    userNotifications: UserNotification[],
  ): boolean {
    for (const userNotification of userNotifications) {
      if (
        users[userIndex].id === userNotification.userId &&
        notifications[notificationIndex].id === userNotification.notificationId
      ) {
        return false;
      }
    }
    return true;
  }

  const maxUserBadges = users.length * notifications.length;

  while (number) {
    if (userNotifications.length === maxUserBadges) return userNotifications;

    const userIndex = Math.floor(Math.random() * users.length);
    const notificationIndex = Math.floor(Math.random() * notifications.length);
    if (
      isNewUserNotification(userIndex, notificationIndex, userNotifications)
    ) {
      const userNotification = await prisma.userNotification.create({
        data: {
          userId: users[userIndex].id,
          notificationId: notifications[notificationIndex].id,
        },
      });
      userNotifications.push(userNotification);
      number--;
    }
  }
  return userNotifications;
};

async function bootstrap() {
  await createSuperAdminUser();
  const users = await createUsers(10);
  await createUserProfiles(users);
  const events = await createEvents(10);
  const tasks = await createTasks(10);
  const taskEvents = await createTaskEvents(tasks, events, 20);
  await createUserTaskEvents(taskEvents, users, 30);
  await createUserBadges(users, tasks, 20);
  const notifications = await createNotifications(10);
  await createUserNotifications(users, notifications, 20);
}

bootstrap();
