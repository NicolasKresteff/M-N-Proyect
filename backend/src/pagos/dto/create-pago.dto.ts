import { IsIn, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export const METODOS_PAGO = [
  'efectivo',
  'tarjeta_debito',
  'tarjeta_credito',
  'transferencia',
  'billetera_virtual',
] as const;

export class CreatePagoDto {
  @IsUUID()
  comandaId: string;

  @IsIn(METODOS_PAGO)
  metodoPago: (typeof METODOS_PAGO)[number];

  @IsNumber()
  @Min(0)
  monto: number;

  @IsOptional()
  @IsString()
  referenciaExterna?: string;
}
