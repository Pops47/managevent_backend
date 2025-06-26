import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { UsersService } from 'src/users/users.service';
import { RequestWithRefresh } from 'src/utils/interfaces/request';
import { AuthService } from './auth.service';
import { RegisterLoginDto } from './dto/register-login.dto';
import { AuthRefreshGuard } from './guards/refresh.guard';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: "Inscription d'un nouvel utilisateur",
    description:
      'Crée un nouveau compte utilisateur et envoie un email de confirmation',
  })
  @ApiBody({ type: RegisterLoginDto })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  @ApiResponse({ status: 403, description: 'Email déjà existant' })
  async register(@Body() payload: RegisterLoginDto) {
    //vérifie si il existe un user avec cet email
    const user = await this.userService.findOneByEmail(payload.email);
    if (user) {
      throw new HttpException('Email already exists', HttpStatus.FORBIDDEN);
    }
    // hash le password
    payload.password = await this.authService.hash(payload.password);
    //crée un confirmToken
    const confirmToken = await this.authService.createToken(
      { email: payload.email },
      process.env.CONFIRM_EMAIL_SECRET_KEY,
      '1d',
    );
    //créé le nouveau user avec mail + confirmtoken
    const newUser = await this.userService.create({
      ...payload,
      confirmToken,
    });

    // envoi le mail de confirmation
    await this.mailerService.sendRegisterConfirmationEmail(
      newUser.email,
      confirmToken,
    );
    return { message: 'User Created', user: newUser };
  }

  @Get('register-confirm/:token')
  @ApiOperation({
    summary: "Confirmation d'inscription",
    description:
      "Confirme l'inscription d'un utilisateur via le token reçu par email",
  })
  @ApiParam({
    name: 'token',
    description: 'Token de confirmation reçu par email',
  })
  @ApiResponse({ status: 200, description: 'Compte activé avec succès' })
  @ApiResponse({ status: 404, description: 'Token non trouvé' })
  @ApiResponse({ status: 401, description: 'Token invalide ou expiré' })
  async verifyConfirmToken(@Param('token') token: string) {
    const user = await this.userService.findOneByConfirmToken(token);
    if (!user) {
      throw new HttpException('Token not found', 404);
    }
    const isValid = await this.authService.isConfirmTokenValid(token);
    if (!isValid) {
      throw new HttpException('Invalid or expired token', 401);
    }
    const newUser = await this.userService.update(user.id, {
      status: 'Active',
    });
    return { message: 'Success', user: newUser };
  }

  @Post('login')
  @ApiOperation({
    summary: 'Connexion utilisateur',
    description: "Authentifie un utilisateur et retourne les tokens d'accès",
  })
  @ApiBody({ type: RegisterLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie, tokens retournés',
  })
  @ApiResponse({
    status: 403,
    description: 'Identifiants incorrects ou compte inactif',
  })
  async login(@Body() payload: RegisterLoginDto) {
    // check if email exist
    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      throw new HttpException('Bad credentials', HttpStatus.FORBIDDEN);
    }
    // check if account is active
    if (user.status === 'Inactive') {
      throw new HttpException(
        'Inactive account, verify email',
        HttpStatus.FORBIDDEN,
      );
    }
    //compare password
    const isMatch = await this.authService.compare(
      payload.password,
      user.password,
    );
    if (!isMatch) {
      throw new HttpException('Bad credentials', HttpStatus.FORBIDDEN);
    }
    // create tokens
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
    //add refreshtoken in user in db
    const updated_user = await this.userService.update(user.id, {
      refreshToken: hashedRefresh,
    });
    return { user: updated_user, token, refreshToken };
  }

  @Get('refresh-token')
  @UseGuards(AuthRefreshGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Rafraîchir le token',
    description: "Génère un nouveau token d'accès à partir du refresh token",
  })
  @ApiResponse({
    status: 200,
    description: 'Nouveaux tokens générés avec succès',
  })
  @ApiResponse({ status: 401, description: 'Token invalide' })
  async refreshToken(
    @Req() req: RequestWithRefresh,
  ): Promise<{ user: User; authToken: string; refreshToken: string }> {
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
    const authToken = await this.authService.createToken(
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
    //update refreshtoken in user in db
    const updated_user = await this.userService.update(user.id, {
      refreshToken: hashedRefresh,
    });

    //return everything
    return { user: updated_user, authToken, refreshToken };
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Demande de réinitialisation de mot de passe',
    description: 'Envoie un email avec un lien de réinitialisation',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Email de réinitialisation envoyé' })
  @ApiResponse({ status: 404, description: 'Aucun utilisateur avec cet email' })
  async sendResetPasswordEmail(@Body() { email }: { email: string }) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('No user with this email', 404);
    }
    const resetPassToken = await this.authService.createToken(
      { id: user.id },
      process.env.RESET_PASS_SECRET_KEY,
      '1h',
    );
    try {
      await this.userService.update(user.id, {
        resetPassToken: resetPassToken,
      });
    } catch (error) {
      console.log(error);
    }
    await this.mailerService.sendResetPasswordEmail(email, resetPassToken);
    return { message: 'Link send by email' };
  }

  @Get('reset-password/:token')
  @ApiOperation({
    summary: 'Vérification du token de réinitialisation',
    description: 'Vérifie la validité du token de réinitialisation',
  })
  @ApiParam({ name: 'token', description: 'Token de réinitialisation' })
  @ApiResponse({ status: 200, description: 'Token valide' })
  @ApiResponse({ status: 404, description: 'Token non trouvé' })
  @ApiResponse({ status: 401, description: 'Token invalide' })
  async displayResetPasswordForm(@Param() token: string) {
    const user = await this.userService.findOneByResetPassToken(token);
    const isValid = await this.authService.isResetPassTokenValid(token);
    if (!user) {
      throw new HttpException('Token not found', 404);
    }
    if (!isValid) {
      throw new HttpException('Invalid Token', 401);
    }
    return { message: 'Success', user };
  }

  @Post('finalize-reset-password')
  @ApiOperation({
    summary: 'Finaliser la réinitialisation de mot de passe',
    description: 'Change le mot de passe avec le nouveau mot de passe fourni',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newPassword: { type: 'string', example: 'newPassword123' },
        token: { type: 'string', example: 'reset-token-here' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe mis à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Token non trouvé' })
  @ApiResponse({ status: 401, description: 'Token invalide' })
  async finalizeResetPassword(
    @Body() { newPassword, token }: { newPassword: string; token: string },
  ) {
    const user = await this.userService.findOneByResetPassToken(token);
    const isValid = await this.authService.isResetPassTokenValid(token);
    if (!user) {
      throw new HttpException('Token not found', 404);
    }
    if (!isValid) {
      throw new HttpException('Invalid Token', 401);
    }
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.update(user.id, {
      password: newHashPassword,
      resetPassToken: null,
    });
    return { message: 'Password updated', user };
  }
}
