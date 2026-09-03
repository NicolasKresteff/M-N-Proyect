import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProductoDto) {
    return this.prisma.producto.create({ data: dto });
  }

  findAll(sucursalId?: string) {
    return this.prisma.producto.findMany({ where: { activo: true, sucursalId } });
  }

  async findOne(id: string) {
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }

  async update(id: string, dto: UpdateProductoDto) {
    await this.findOne(id);
    return this.prisma.producto.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.producto.update({ where: { id }, data: { activo: false } });
  }
}
