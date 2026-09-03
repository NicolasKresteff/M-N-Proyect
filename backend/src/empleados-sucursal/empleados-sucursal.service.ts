import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEmpleadoSucursalDto } from './dto/create-empleado-sucursal.dto.js';
import { UpdateEmpleadoSucursalDto } from './dto/update-empleado-sucursal.dto.js';

@Injectable()
export class EmpleadosSucursalService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateEmpleadoSucursalDto) {
    return this.prisma.empleadoSucursal.create({
      data: {
        usuarioId: dto.usuarioId,
        sucursalId: dto.sucursalId,
        rol: dto.rol,
        fechaIngreso: new Date(dto.fechaIngreso),
      },
    });
  }

  findAll(sucursalId?: string) {
    return this.prisma.empleadoSucursal.findMany({
      where: { activo: true, sucursalId },
      include: { usuario: true },
    });
  }

  async findOne(id: string) {
    const empleado = await this.prisma.empleadoSucursal.findUnique({
      where: { id },
      include: { usuario: true, sucursal: true },
    });
    if (!empleado) {
      throw new NotFoundException('Relación empleado-sucursal no encontrada');
    }
    return empleado;
  }

  async update(id: string, dto: UpdateEmpleadoSucursalDto) {
    await this.findOne(id);
    // Un egreso implica baja lógica, para liberar el índice único parcial
    // (usuario_id, sucursal_id) WHERE activo = true y permitir reingresos.
    const activo = dto.fechaEgreso ? (dto.activo ?? false) : dto.activo;
    return this.prisma.empleadoSucursal.update({
      where: { id },
      data: {
        rol: dto.rol,
        fechaEgreso: dto.fechaEgreso ? new Date(dto.fechaEgreso) : undefined,
        activo,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.empleadoSucursal.update({ where: { id }, data: { activo: false } });
  }
}
