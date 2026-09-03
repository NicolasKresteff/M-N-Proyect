import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { CreateDetalleComandaDto } from './create-detalle-comanda.dto.js';

export class CreateComandaDto {
  @IsUUID()
  sucursalId: string;

  @IsUUID()
  empleadoSucursalId: string;

  @IsString()
  @MaxLength(20)
  mesa: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleComandaDto)
  detalles: CreateDetalleComandaDto[];
}
