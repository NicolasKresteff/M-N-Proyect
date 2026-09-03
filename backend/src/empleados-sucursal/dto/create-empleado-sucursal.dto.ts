import { IsDateString, IsIn, IsUUID } from 'class-validator';

export const ROLES_EMPLEADO = ['mozo', 'cocina', 'gerencia', 'admin'] as const;
export type RolEmpleado = (typeof ROLES_EMPLEADO)[number];

export class CreateEmpleadoSucursalDto {
  @IsUUID()
  usuarioId: string;

  @IsUUID()
  sucursalId: string;

  @IsIn(ROLES_EMPLEADO)
  rol: RolEmpleado;

  @IsDateString()
  fechaIngreso: string;
}
