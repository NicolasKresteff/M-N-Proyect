import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSucursalDto } from './dto/create-sucursal.dto.js';
import { UpdateSucursalDto } from './dto/update-sucursal.dto.js';

@Injectable()
export class SucursalesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSucursalDto) {
    return this.prisma.sucursal.create({
      data: { ...dto, horario: dto.horario as Prisma.InputJsonValue | undefined },
    });
  }

  findAll(comercioId?: string) {
    return this.prisma.sucursal.findMany({
      where: { activo: true, comercioId },
    });
  }

  async findOne(id: string) {
    const sucursal = await this.prisma.sucursal.findUnique({
      where: { id },
      include: { productos: true },
    });
    if (!sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }
    return sucursal;
  }

  async update(id: string, dto: UpdateSucursalDto) {
    await this.findOne(id);
    return this.prisma.sucursal.update({
      where: { id },
      data: { ...dto, horario: dto.horario as Prisma.InputJsonValue | undefined },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.sucursal.update({ where: { id }, data: { activo: false } });
  }
}
