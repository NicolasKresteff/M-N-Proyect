import { Module } from '@nestjs/common';
import { ComandasGateway } from './comandas.gateway.js';

@Module({
  providers: [ComandasGateway],
  exports: [ComandasGateway],
})
export class WebsocketsModule {}
