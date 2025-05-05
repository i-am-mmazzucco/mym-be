// src/me/me.controller.ts
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { MeService } from './me.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  getUserData() {
    return this.meService.getUserData();
  }

  @Patch()
  updateUserData(@Body() userData: any) {
    return this.meService.updateUserData(userData);
  }
}
