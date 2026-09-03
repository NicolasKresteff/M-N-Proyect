import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ComerciosService } from './comercios.service.js';
import { CreateComercioDto } from './dto/create-comercio.dto.js';
import { UpdateComercioDto } from './dto/update-comercio.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('comercios')
export class ComerciosController {
  constructor(private readonly comerciosService: ComerciosService) {}

  @Post()
  create(@Body() dto: CreateComercioDto) {
    return this.comerciosService.create(dto);
  }

  @Get()
  findAll() {
    return this.comerciosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comerciosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateComercioDto) {
    return this.comerciosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comerciosService.remove(id);
  }
}
