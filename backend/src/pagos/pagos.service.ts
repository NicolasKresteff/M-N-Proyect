import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePagoDto } from './dto/create-pago.dto.js';
import { UpdateEstadoPagoDto } from './dto/update-estado-pago.dto.js';

@Injectable()
export class PagosService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePagoDto) {
    return this.prisma.pago.create({ data: dto });
  }

  findAllByComanda(comandaId: string) {
    return this.prisma.pago.findMany({ where: { comandaId } });
  }

  async findOne(id: string) {
    const pago = await this.prisma.pago.findUnique({ where: { id } });
    if (!pago) {
      throw new NotFoundException('Pago no encontrado');
    }
    return pago;
  }

  async updateEstado(id: string, dto: UpdateEstadoPagoDto) {
    await this.findOne(id);
    return this.prisma.pago.update({ where: { id }, data: { estado: dto.estado } });
  }
}
