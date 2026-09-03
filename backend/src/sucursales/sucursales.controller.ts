import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SucursalesService } from './sucursales.service.js';
import { CreateSucursalDto } from './dto/create-sucursal.dto.js';
import { UpdateSucursalDto } from './dto/update-sucursal.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @Post()
  create(@Body() dto: CreateSucursalDto) {
    return this.sucursalesService.create(dto);
  }

  @Get()
  findAll(@Query('comercioId') comercioId?: string) {
    return this.sucursalesService.findAll(comercioId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sucursalesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSucursalDto) {
    return this.sucursalesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sucursalesService.remove(id);
  }
}
