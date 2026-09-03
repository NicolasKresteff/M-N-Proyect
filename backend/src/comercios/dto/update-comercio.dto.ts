import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateComercioDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  razonSocial?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombreComercial?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
