import { IsIn, IsUUID } from 'class-validator';
import { ESTADOS_COMANDA } from '../comandas.constants.js';
import type { EstadoComanda } from '../comandas.constants.js';

export class UpdateEstadoComandaDto {
  @IsIn(ESTADOS_COMANDA)
  estado: EstadoComanda;

  // Empleado que realiza el cambio (para el registro en HistorialComanda).
  // Simplificación temporal: hasta resolver el mapeo usuario JWT -> empleado
  // activo en la sucursal, se recibe explícito en el body.
  @IsUUID()
  empleadoSucursalId: string;
}
