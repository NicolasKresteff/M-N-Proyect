import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { EmpleadosSucursalService } from './empleados-sucursal.service.js';
import { EmpleadosSucursalController } from './empleados-sucursal.controller.js';

@Module({
  imports: [AuthModule],
  providers: [EmpleadosSucursalService],
  controllers: [EmpleadosSucursalController],
  exports: [EmpleadosSucursalService],
})
export class EmpleadosSucursalModule {}
