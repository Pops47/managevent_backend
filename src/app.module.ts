import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProfilesModule } from './profiles/profiles.module';
import { TaskEventsModule } from './task-events/task-events.module';
import { TasksModule } from './tasks/tasks.module';
import { UserNotificationsModule } from './user-notifications/user-notifications.module';
import { UserTaskEventsModule } from './user-task-events/user-task-events.module';
import { UsersModule } from './users/users.module';
import { UserBadgesModule } from './user-badges/user-badges.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ProfilesModule,
    TasksModule,
    EventsModule,
    NotificationsModule,
    TaskEventsModule,
    UserTaskEventsModule,
    UserNotificationsModule,
    UserBadgesModule,
    UserBadgesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
