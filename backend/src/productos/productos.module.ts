import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ProductosService } from './productos.service.js';
import { ProductosController } from './productos.controller.js';

@Module({
  imports: [AuthModule],
  providers: [ProductosService],
  controllers: [ProductosController],
  exports: [ProductosService],
})
export class ProductosModule {}
