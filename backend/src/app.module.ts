import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { ComerciosModule } from './comercios/comercios.module.js';
import { SucursalesModule } from './sucursales/sucursales.module.js';
import { EmpleadosSucursalModule } from './empleados-sucursal/empleados-sucursal.module.js';
import { ProductosModule } from './productos/productos.module.js';
import { ComandasModule } from './comandas/comandas.module.js';
import { PagosModule } from './pagos/pagos.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    ComerciosModule,
    SucursalesModule,
    EmpleadosSucursalModule,
    ProductosModule,
    ComandasModule,
    PagosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
