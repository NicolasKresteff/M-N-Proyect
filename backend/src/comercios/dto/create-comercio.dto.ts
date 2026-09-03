import { IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateComercioDto {
  @IsUUID()
  usuarioId: string;

  @IsString()
  @MaxLength(150)
  razonSocial: string;

  @IsString()
  @MaxLength(150)
  nombreComercial: string;

  @IsString()
  @MaxLength(20)
  identificadorFiscal: string;
}
