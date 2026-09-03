import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { SucursalesService } from './sucursales.service.js';
import { SucursalesController } from './sucursales.controller.js';

@Module({
  imports: [AuthModule],
  providers: [SucursalesService],
  controllers: [SucursalesController],
  exports: [SucursalesService],
})
export class SucursalesModule {}
