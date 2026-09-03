import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateDetalleComandaDto {
  @IsUUID()
  productoId: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
