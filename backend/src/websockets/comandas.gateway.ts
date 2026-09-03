import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// Los clientes se unen a la room `sucursal:<id>` para recibir solo los
// eventos de su propia sucursal (mozos, cocina y backoffice de otras
// sucursales no necesitan verlos).
@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URL ?? '*' } })
export class ComandasGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.on('join-sucursal', (sucursalId: string) => {
      client.join(`sucursal:${sucursalId}`);
    });
  }

  handleDisconnect() {
    // No requiere limpieza manual: socket.io libera las rooms al desconectar.
  }

  @SubscribeMessage('join-sucursal')
  joinSucursal(client: Socket, sucursalId: string) {
    client.join(`sucursal:${sucursalId}`);
  }

  emitComandaCreada(sucursalId: string, comanda: unknown) {
    this.server.to(`sucursal:${sucursalId}`).emit('comanda:creada', comanda);
  }

  emitComandaActualizada(sucursalId: string, comanda: unknown) {
    this.server.to(`sucursal:${sucursalId}`).emit('comanda:actualizada', comanda);
  }

  emitDetalleActualizado(sucursalId: string, detalle: unknown) {
    this.server.to(`sucursal:${sucursalId}`).emit('detalle-comanda:actualizado', detalle);
  }
}
