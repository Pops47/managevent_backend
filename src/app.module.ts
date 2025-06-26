import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from '../prisma/prisma.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { MailerModule } from './mailer/mailer.module';
import { MediaModule } from './media/media.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProfilesModule } from './profiles/profiles.module';
import { TaskEventsModule } from './task-events/task-events.module';
import { TasksModule } from './tasks/tasks.module';
import { UserBadgesModule } from './user-badges/user-badges.module';
import { UserNotificationsModule } from './user-notifications/user-notifications.module';
import { UserTaskEventsModule } from './user-task-events/user-task-events.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../'),
      renderPath: '/upload',
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule globally available
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.local',
    }),
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
    AuthModule,
    MediaModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
