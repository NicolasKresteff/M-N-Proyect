import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PagosService } from './pagos.service.js';
import { CreatePagoDto } from './dto/create-pago.dto.js';
import { UpdateEstadoPagoDto } from './dto/update-estado-pago.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post()
  create(@Body() dto: CreatePagoDto) {
    return this.pagosService.create(dto);
  }

  @Get()
  findAllByComanda(@Query('comandaId') comandaId: string) {
    return this.pagosService.findAllByComanda(comandaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagosService.findOne(id);
  }

  @Patch(':id/estado')
  updateEstado(@Param('id') id: string, @Body() dto: UpdateEstadoPagoDto) {
    return this.pagosService.updateEstado(id, dto);
  }
}
