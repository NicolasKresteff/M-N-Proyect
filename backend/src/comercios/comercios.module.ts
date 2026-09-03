import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ComerciosService } from './comercios.service.js';
import { ComerciosController } from './comercios.controller.js';

@Module({
  imports: [AuthModule],
  providers: [ComerciosService],
  controllers: [ComerciosController],
  exports: [ComerciosService],
})
export class ComerciosModule {}
