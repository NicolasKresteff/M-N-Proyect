import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';

const SALT_ROUNDS = 10;

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUsuarioDto) {
    const existente = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existente) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        passwordHash,
        telefono: dto.telefono,
        fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : undefined,
      },
    });

    return this.sanitize(usuario);
  }

  async findAll() {
    const usuarios = await this.prisma.usuario.findMany({ where: { activo: true } });
    return usuarios.map((u) => this.sanitize(u));
  }

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.sanitize(usuario);
  }

  async update(id: string, dto: UpdateUsuarioDto) {
    await this.findOne(id);
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: {
        ...dto,
        fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : undefined,
      },
    });
    return this.sanitize(usuario);
  }

  async remove(id: string) {
    await this.findOne(id);
    // Borrado lógico: ver convenciones del informe técnico.
    const usuario = await this.prisma.usuario.update({ where: { id }, data: { activo: false } });
    return this.sanitize(usuario);
  }

  private sanitize(usuario: { passwordHash: string; [key: string]: unknown }) {
    const { passwordHash: _passwordHash, ...resto } = usuario;
    return resto;
  }
}
