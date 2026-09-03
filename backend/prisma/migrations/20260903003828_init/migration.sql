-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(30),
    "fecha_nacimiento" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comercio" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuario_id" UUID NOT NULL,
    "razon_social" VARCHAR(150) NOT NULL,
    "nombre_comercial" VARCHAR(150) NOT NULL,
    "identificador_fiscal" VARCHAR(20) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comercio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursal" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "comercio_id" UUID NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "latitud" DECIMAL(9,6),
    "longitud" DECIMAL(9,6),
    "telefono" VARCHAR(30),
    "horario" JSONB,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empleado_sucursal" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuario_id" UUID NOT NULL,
    "sucursal_id" UUID NOT NULL,
    "rol" VARCHAR(30) NOT NULL,
    "fecha_ingreso" DATE NOT NULL,
    "fecha_egreso" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empleado_sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sucursal_id" UUID NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "categoria" VARCHAR(100) NOT NULL,
    "imagen_url" VARCHAR(255),
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comanda" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sucursal_id" UUID NOT NULL,
    "empleado_sucursal_id" UUID NOT NULL,
    "mesa" VARCHAR(20) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'abierta',
    "observaciones" TEXT,
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "fecha_apertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMP(3),

    CONSTRAINT "comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_comanda" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "comanda_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "observaciones" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "detalle_comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pago" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "comanda_id" UUID NOT NULL,
    "metodo_pago" VARCHAR(30) NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "referencia_externa" VARCHAR(100),
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_comanda" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "comanda_id" UUID NOT NULL,
    "cambio" JSONB NOT NULL,
    "empleado_sucursal_id" UUID NOT NULL,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_comanda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_detalle_comanda" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "detalle_comanda_id" UUID NOT NULL,
    "cambio" JSONB NOT NULL,
    "empleado_sucursal_id" UUID NOT NULL,
    "fecha_modificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_detalle_comanda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "comercio_identificador_fiscal_key" ON "comercio"("identificador_fiscal");

-- CreateIndex
CREATE INDEX "comanda_sucursal_id_estado_idx" ON "comanda"("sucursal_id", "estado");

-- CreateIndex
CREATE INDEX "detalle_comanda_comanda_id_idx" ON "detalle_comanda"("comanda_id");

-- CreateIndex
CREATE INDEX "pago_comanda_id_idx" ON "pago"("comanda_id");

-- CreateIndex
CREATE INDEX "historial_comanda_comanda_id_fecha_modificacion_idx" ON "historial_comanda"("comanda_id", "fecha_modificacion");

-- AddForeignKey
ALTER TABLE "comercio" ADD CONSTRAINT "comercio_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sucursal" ADD CONSTRAINT "sucursal_comercio_id_fkey" FOREIGN KEY ("comercio_id") REFERENCES "comercio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleado_sucursal" ADD CONSTRAINT "empleado_sucursal_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleado_sucursal" ADD CONSTRAINT "empleado_sucursal_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comanda" ADD CONSTRAINT "comanda_empleado_sucursal_id_fkey" FOREIGN KEY ("empleado_sucursal_id") REFERENCES "empleado_sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_comanda" ADD CONSTRAINT "detalle_comanda_comanda_id_fkey" FOREIGN KEY ("comanda_id") REFERENCES "comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_comanda" ADD CONSTRAINT "detalle_comanda_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_comanda_id_fkey" FOREIGN KEY ("comanda_id") REFERENCES "comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_comanda" ADD CONSTRAINT "historial_comanda_comanda_id_fkey" FOREIGN KEY ("comanda_id") REFERENCES "comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_comanda" ADD CONSTRAINT "historial_comanda_empleado_sucursal_id_fkey" FOREIGN KEY ("empleado_sucursal_id") REFERENCES "empleado_sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_detalle_comanda" ADD CONSTRAINT "historial_detalle_comanda_detalle_comanda_id_fkey" FOREIGN KEY ("detalle_comanda_id") REFERENCES "detalle_comanda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_detalle_comanda" ADD CONSTRAINT "historial_detalle_comanda_empleado_sucursal_id_fkey" FOREIGN KEY ("empleado_sucursal_id") REFERENCES "empleado_sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
