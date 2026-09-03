import { IsIn } from 'class-validator';

export const ESTADOS_PAGO = ['pendiente', 'aprobado', 'rechazado', 'reembolsado'] as const;

export class UpdateEstadoPagoDto {
  @IsIn(ESTADOS_PAGO)
  estado: (typeof ESTADOS_PAGO)[number];
}
