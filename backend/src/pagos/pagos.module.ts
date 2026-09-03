import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PagosService } from './pagos.service.js';
import { PagosController } from './pagos.controller.js';

@Module({
  imports: [AuthModule],
  providers: [PagosService],
  controllers: [PagosController],
  exports: [PagosService],
})
export class PagosModule {}
