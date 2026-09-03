import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { EmpleadosSucursalService } from './empleados-sucursal.service.js';
import { CreateEmpleadoSucursalDto } from './dto/create-empleado-sucursal.dto.js';
import { UpdateEmpleadoSucursalDto } from './dto/update-empleado-sucursal.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('empleados-sucursal')
export class EmpleadosSucursalController {
  constructor(private readonly empleadosSucursalService: EmpleadosSucursalService) {}

  @Post()
  create(@Body() dto: CreateEmpleadoSucursalDto) {
    return this.empleadosSucursalService.create(dto);
  }

  @Get()
  findAll(@Query('sucursalId') sucursalId?: string) {
    return this.empleadosSucursalService.findAll(sucursalId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empleadosSucursalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmpleadoSucursalDto) {
    return this.empleadosSucursalService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empleadosSucursalService.remove(id);
  }
}
