import { IsBoolean, IsDateString, IsIn, IsOptional } from 'class-validator';
import { ROLES_EMPLEADO } from './create-empleado-sucursal.dto.js';
import type { RolEmpleado } from './create-empleado-sucursal.dto.js';

export class UpdateEmpleadoSucursalDto {
  @IsOptional()
  @IsIn(ROLES_EMPLEADO)
  rol?: RolEmpleado;

  @IsOptional()
  @IsDateString()
  fechaEgreso?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
