import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { RequestWithRefresh } from 'src/utils/interfaces/request.interfaces';
import { AuthService } from './auth.service';
import { RegisterLoginDto } from './dto/register-login.dto';
import { AuthRefreshGuard } from './guards/refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() payload: RegisterLoginDto) {
    const user = await this.userService.findOneByEmail(payload.email);
    if (user) {
      throw new HttpException('Email already exists', HttpStatus.FORBIDDEN);
    }

    payload.password = await this.authService.hash(payload.password);

    const newUser = await this.userService.create(payload);

    // todo: envoi mail a payload.email

    return { user: newUser };
  }

  @Post('login')
  async login(@Body() payload: RegisterLoginDto) {
    // check if email exist
    const user = await this.userService.findOneByEmail(payload.email);

    if (!user) {
      throw new HttpException('Bad credentials', HttpStatus.FORBIDDEN);
    }

    //compare password
    const isMatch = await this.authService.compare(
      payload.password,
      user.password,
    );

    if (!isMatch) {
      throw new HttpException('Bad credentials', HttpStatus.FORBIDDEN);
    }

    // create token
    const token = await this.authService.createToken(
      { id: user.id, email: payload.email, role: user.role },
      process.env.SECRET_KEY,
      '3h',
    );
    const refreshToken = await this.authService.createToken(
      { id: user.id, email: payload.email, role: user.role },
      process.env.REFRESH_SECRET_KEY,
      '3d',
    );

    const hashedRefresh = await this.authService.hash(refreshToken);

    const updated_user = await this.userService.update(user.id, {
      refreshToken: hashedRefresh,
    });

    return { user: updated_user, token, refreshToken };
  }

  @Get('refresh-token')
  @UseGuards(AuthRefreshGuard)
  async refreshToken(
    @Req() req: RequestWithRefresh,
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    // get user from payload
    const user: User = await this.userService.findOneById(req.user.id);
    // check user exists
    if (!user) throw new HttpException("User doesn't exist", 404);

    // check user.refresh === refresh
    const isMatched: boolean = await this.authService.compare(
      req.refreshToken,
      user.refreshToken,
    );
    if (!isMatched) throw new HttpException('Bad token', 404);

    // create new token // refreshToken
    const token = await this.authService.createToken(
      { id: user.id, email: req.user.email, role: user.role },
      process.env.SECRET_KEY,
      '3h',
    );
    const refreshToken = await this.authService.createToken(
      { id: user.id, email: req.user.email, role: user.role },
      process.env.REFRESH_SECRET_KEY,
      '3d',
    );

    const hashedRefresh = await this.authService.hash(refreshToken);

    const updated_user = await this.userService.update(user.id, {
      refreshToken: hashedRefresh,
    });

    //return everything
    return { user: updated_user, token, refreshToken };
  }
}
