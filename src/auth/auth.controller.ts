// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginData: any) {
    return this.authService.login(loginData);
  }

  @Post('register')
  register(@Body() registerData: any) {
    return this.authService.register(registerData);
  }
}