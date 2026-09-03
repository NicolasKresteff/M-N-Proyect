import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ComandasService } from './comandas.service.js';
import { CreateComandaDto } from './dto/create-comanda.dto.js';
import { CreateDetalleComandaDto } from './dto/create-detalle-comanda.dto.js';
import { UpdateEstadoComandaDto } from './dto/update-estado-comanda.dto.js';
import { UpdateEstadoDetalleDto } from './dto/update-estado-detalle.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('comandas')
export class ComandasController {
  constructor(private readonly comandasService: ComandasService) {}

  @Post()
  create(@Body() dto: CreateComandaDto) {
    return this.comandasService.create(dto);
  }

  @Get()
  findAll(@Query('sucursalId') sucursalId?: string, @Query('estado') estado?: string) {
    return this.comandasService.findAll(sucursalId, estado);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comandasService.findOne(id);
  }

  @Post(':id/detalles')
  addDetalle(@Param('id') id: string, @Body() dto: CreateDetalleComandaDto) {
    return this.comandasService.addDetalle(id, dto);
  }

  @Patch(':id/estado')
  updateEstado(@Param('id') id: string, @Body() dto: UpdateEstadoComandaDto) {
    return this.comandasService.updateEstado(id, dto);
  }

  @Patch(':id/detalles/:detalleId/estado')
  updateEstadoDetalle(
    @Param('id') id: string,
    @Param('detalleId') detalleId: string,
    @Body() dto: UpdateEstadoDetalleDto,
  ) {
    return this.comandasService.updateEstadoDetalle(id, detalleId, dto);
  }
}
