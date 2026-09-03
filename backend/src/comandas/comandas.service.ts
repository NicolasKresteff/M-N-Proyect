import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { ComandasGateway } from '../websockets/comandas.gateway.js';
import { CreateComandaDto } from './dto/create-comanda.dto.js';
import { CreateDetalleComandaDto } from './dto/create-detalle-comanda.dto.js';
import { UpdateEstadoComandaDto } from './dto/update-estado-comanda.dto.js';
import { UpdateEstadoDetalleDto } from './dto/update-estado-detalle.dto.js';

const INCLUDE_COMANDA_COMPLETA = {
  detalles: { include: { producto: true } },
  pagos: true,
} satisfies Prisma.ComandaInclude;

@Injectable()
export class ComandasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: ComandasGateway,
  ) {}

  async create(dto: CreateComandaDto) {
    const productos = await this.prisma.producto.findMany({
      where: { id: { in: dto.detalles.map((d) => d.productoId) } },
    });
    const precioPorProducto = new Map(productos.map((p) => [p.id, p.precio]));

    let total = new Prisma.Decimal(0);
    const detallesData = dto.detalles.map((detalle) => {
      const precioUnitario = precioPorProducto.get(detalle.productoId);
      if (!precioUnitario) {
        throw new NotFoundException(`Producto ${detalle.productoId} no encontrado`);
      }
      const subtotal = precioUnitario.mul(detalle.cantidad);
      total = total.add(subtotal);
      return {
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
        precioUnitario,
        subtotal,
        observaciones: detalle.observaciones,
      };
    });

    const comanda = await this.prisma.comanda.create({
      data: {
        sucursalId: dto.sucursalId,
        empleadoSucursalId: dto.empleadoSucursalId,
        mesa: dto.mesa,
        observaciones: dto.observaciones,
        total,
        detalles: { create: detallesData },
      },
      include: INCLUDE_COMANDA_COMPLETA,
    });

    this.gateway.emitComandaCreada(dto.sucursalId, comanda);
    return comanda;
  }

  findAll(sucursalId?: string, estado?: string) {
    return this.prisma.comanda.findMany({
      where: { sucursalId, estado },
      include: INCLUDE_COMANDA_COMPLETA,
      orderBy: { fechaApertura: 'desc' },
    });
  }

  async findOne(id: string) {
    const comanda = await this.prisma.comanda.findUnique({
      where: { id },
      include: {
        ...INCLUDE_COMANDA_COMPLETA,
        historial: { orderBy: { fechaModificacion: 'desc' } },
      },
    });
    if (!comanda) {
      throw new NotFoundException('Comanda no encontrada');
    }
    return comanda;
  }

  async addDetalle(comandaId: string, dto: CreateDetalleComandaDto) {
    const comanda = await this.findOne(comandaId);
    const producto = await this.prisma.producto.findUnique({ where: { id: dto.productoId } });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    const subtotal = producto.precio.mul(dto.cantidad);

    const [, comandaActualizada] = await this.prisma.$transaction([
      this.prisma.detalleComanda.create({
        data: {
          comandaId,
          productoId: dto.productoId,
          cantidad: dto.cantidad,
          precioUnitario: producto.precio,
          subtotal,
          observaciones: dto.observaciones,
        },
      }),
      this.prisma.comanda.update({
        where: { id: comandaId },
        data: { total: comanda.total.add(subtotal) },
        include: INCLUDE_COMANDA_COMPLETA,
      }),
    ]);

    this.gateway.emitComandaActualizada(comandaActualizada.sucursalId, comandaActualizada);
    return comandaActualizada;
  }

  async updateEstado(id: string, dto: UpdateEstadoComandaDto) {
    const comanda = await this.findOne(id);

    const [comandaActualizada] = await this.prisma.$transaction([
      this.prisma.comanda.update({
        where: { id },
        data: {
          estado: dto.estado,
          fechaCierre: dto.estado === 'cerrada' ? new Date() : undefined,
        },
        include: INCLUDE_COMANDA_COMPLETA,
      }),
      this.prisma.historialComanda.create({
        data: {
          comandaId: id,
          empleadoSucursalId: dto.empleadoSucursalId,
          cambio: { campo: 'estado', valor_anterior: comanda.estado, valor_nuevo: dto.estado },
        },
      }),
    ]);

    this.gateway.emitComandaActualizada(comandaActualizada.sucursalId, comandaActualizada);
    return comandaActualizada;
  }

  async updateEstadoDetalle(comandaId: string, detalleId: string, dto: UpdateEstadoDetalleDto) {
    const detalle = await this.prisma.detalleComanda.findUnique({ where: { id: detalleId } });
    if (!detalle || detalle.comandaId !== comandaId) {
      throw new NotFoundException('Detalle de comanda no encontrado');
    }

    const [detalleActualizado] = await this.prisma.$transaction([
      this.prisma.detalleComanda.update({
        where: { id: detalleId },
        data: { estado: dto.estado },
        include: { producto: true },
      }),
      this.prisma.historialDetalleComanda.create({
        data: {
          detalleComandaId: detalleId,
          empleadoSucursalId: dto.empleadoSucursalId,
          cambio: { campo: 'estado', valor_anterior: detalle.estado, valor_nuevo: dto.estado },
        },
      }),
    ]);

    const comanda = await this.prisma.comanda.findUniqueOrThrow({ where: { id: comandaId } });
    this.gateway.emitDetalleActualizado(comanda.sucursalId, detalleActualizado);
    return detalleActualizado;
  }
}
