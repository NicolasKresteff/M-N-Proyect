import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateComercioDto } from './dto/create-comercio.dto.js';
import { UpdateComercioDto } from './dto/update-comercio.dto.js';

@Injectable()
export class ComerciosService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateComercioDto) {
    return this.prisma.comercio.create({ data: dto });
  }

  findAll() {
    return this.prisma.comercio.findMany({ where: { activo: true } });
  }

  async findOne(id: string) {
    const comercio = await this.prisma.comercio.findUnique({
      where: { id },
      include: { sucursales: true },
    });
    if (!comercio) {
      throw new NotFoundException('Comercio no encontrado');
    }
    return comercio;
  }

  async update(id: string, dto: UpdateComercioDto) {
    await this.findOne(id);
    return this.prisma.comercio.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.comercio.update({ where: { id }, data: { activo: false } });
  }
}
