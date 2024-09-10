import { RoleEnum } from '@prisma/client';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: RoleEnum;
  };
}

export interface RequestWithRefresh extends RequestWithUser {
  refreshToken: string;
}
