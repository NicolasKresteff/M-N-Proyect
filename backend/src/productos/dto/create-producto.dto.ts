import { IsNumber, IsOptional, IsString, IsUUID, Min, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @IsUUID()
  sucursalId: string;

  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsString()
  @MaxLength(100)
  categoria: string;

  @IsOptional()
  @IsString()
  imagenUrl?: string;
}
