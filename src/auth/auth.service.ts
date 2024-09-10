import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async createToken(
    payload: { id?: string; email?: string; role?: RoleEnum },
    secret: string,
    expiration: string | number,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiration,
    });
  }

  async isResetPassTokenValid(token: string): Promise<boolean> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.RESET_PASS_SECRET_KEY,
    });
    if (!payload) {
      return false;
    }
    return true;
  }

  async isConfirmTokenValid(token: string): Promise<boolean> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.CONFIRM_EMAIL_SECRET_KEY,
    });
    if (!payload) {
      return false;
    }
    return true;
  }
}
