-- Enums como varchar + CHECK constraint (decisión cerrada del informe técnico,
-- ver prisma/schema.prisma para el detalle de cada columna).

ALTER TABLE "comanda"
  ADD CONSTRAINT "comanda_estado_check"
  CHECK (estado IN ('abierta', 'en_preparacion', 'servida', 'cerrada', 'cancelada'));

ALTER TABLE "detalle_comanda"
  ADD CONSTRAINT "detalle_comanda_estado_check"
  CHECK (estado IN ('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'));

ALTER TABLE "pago"
  ADD CONSTRAINT "pago_metodo_pago_check"
  CHECK (metodo_pago IN ('efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia', 'billetera_virtual'));

ALTER TABLE "pago"
  ADD CONSTRAINT "pago_estado_check"
  CHECK (estado IN ('pendiente', 'aprobado', 'rechazado', 'reembolsado'));

-- Índice único parcial: solo puede existir una relación ACTIVA entre un
-- mismo usuario y una misma sucursal a la vez, pero permite reingresos
-- (múltiples relaciones históricas inactivas).
CREATE UNIQUE INDEX "uq_empleado_sucursal_activo"
  ON "empleado_sucursal" (usuario_id, sucursal_id)
  WHERE activo = true;
