import { IsIn, IsUUID } from 'class-validator';
import { ESTADOS_DETALLE_COMANDA } from '../comandas.constants.js';
import type { EstadoDetalleComanda } from '../comandas.constants.js';

export class UpdateEstadoDetalleDto {
  @IsIn(ESTADOS_DETALLE_COMANDA)
  estado: EstadoDetalleComanda;

  @IsUUID()
  empleadoSucursalId: string;
}
