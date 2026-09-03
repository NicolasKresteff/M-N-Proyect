import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { WebsocketsModule } from '../websockets/websockets.module.js';
import { ComandasService } from './comandas.service.js';
import { ComandasController } from './comandas.controller.js';

@Module({
  imports: [AuthModule, WebsocketsModule],
  providers: [ComandasService],
  controllers: [ComandasController],
  exports: [ComandasService],
})
export class ComandasModule {}
