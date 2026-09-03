import { IsLatitude, IsLongitude, IsObject, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateSucursalDto {
  @IsUUID()
  comercioId: string;

  @IsString()
  @MaxLength(150)
  nombre: string;

  @IsString()
  @MaxLength(255)
  direccion: string;

  @IsOptional()
  @IsLatitude()
  latitud?: number;

  @IsOptional()
  @IsLongitude()
  longitud?: number;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsObject()
  horario?: Record<string, unknown>;
}
