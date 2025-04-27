import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientDto } from './clients.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  getClients() {
    return this.clientsService.getClients();
  }

  @Get(':id')
  getClient(@Param('id') id: string) {
    return this.clientsService.getClient(id);
  }

  @Post()
  createClient(@Body() body: ClientDto) {
    return this.clientsService.createClient(body);
  }

  @Patch(':id')
  updateClient(@Param('id') id: string, @Body() body: ClientDto) {
    return this.clientsService.updateClient(id, body);
  }
}
