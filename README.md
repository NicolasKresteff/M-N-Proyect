# M&N — Sistema de gestión de comandas

Sistema de gestión digital de comandas con visualización en tiempo real para
restaurantes/locales gastronómicos (una o varias sucursales). Ver el
"Informe Técnico draft Mauriji ft Elniki" (Google Docs) para el detalle
funcional completo: alcance, actores, modelo de dominio y reglas de negocio.

## Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: NestJS + TypeScript, módulos por dominio, Prisma ORM, Socket.io, JWT
- **Base de datos**: PostgreSQL
- **Infra**: Docker (un contenedor para el backend, otro para Postgres). El
  frontend corre local con Vite (no está containerizado).

## Estructura

```
backend/    NestJS API (REST + WebSocket gateway)
frontend/   React app (Vite)
docker-compose.yml   backend + postgres
```

## Requisitos

- Node.js 24+
- Docker Desktop

## Puesta en marcha

### 1. Variables de entorno

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Los defaults ya sirven para desarrollo local, no hace falta tocarlos.

### 2. Backend + base de datos (Docker)

```bash
docker compose up -d
```

Esto levanta Postgres y el backend (con `prisma migrate deploy` automático
al arrancar el contenedor). La API queda en `http://localhost:3000`.

Para ver logs: `docker compose logs -f backend`.

### 3. Primera vez: crear las migraciones

El repo ya incluye las migraciones iniciales en `backend/prisma/migrations`.
Si modificás `backend/prisma/schema.prisma`, generá una nueva migración
corriendo (con Postgres levantado, puerto 5432 expuesto):

```bash
cd backend
npx prisma migrate dev --name nombre_del_cambio
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre en `http://localhost:5173`.

## Cuenta de prueba

No hay seed automático todavía. Registrá un usuario contra la API:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Tu Nombre","email":"vos@ejemplo.com","password":"password123"}'
```

Con el `accessToken` de la respuesta ya podés loguearte en el frontend, o
pegarlo como `Authorization: Bearer <token>` para probar el resto de la API
(comercios, sucursales, productos, comandas, pagos).

## Notas de diseño / decisiones simplificadas para arrancar

- **Rol de empleado por sucursal**: `EmpleadoSucursal.rol` (mozo/cocina/
  gerencia/admin) no estaba en la tabla de atributos del informe original;
  se agregó porque el JWT necesita algo para autorizar por rol. Revisarlo
  con el equipo antes de darlo por cerrado.
- **Quién hizo el cambio en `HistorialComanda`/`HistorialDetalleComanda`**:
  por ahora se recibe `empleadoSucursalId` explícito en el body de los
  endpoints de cambio de estado, en vez de resolverlo automáticamente desde
  el usuario del JWT. Falta decidir cómo mapear "usuario logueado" ->
  "empleado activo en tal sucursal" (un usuario puede tener varias
  relaciones activas en distintas sucursales).
- **Offline-first** (sucursales sin conexión, sync de comandas/pagos): queda
  fuera del alcance de este arranque, tal como lo marca el informe técnico
  en "Decisiones abiertas". El modelo de datos no tiene todavía campos de
  sincronización.
- **CHECK constraints** de los campos tipo enum (estado de comanda, detalle,
  pago, método de pago) se agregan a mano en la migración
  `add_check_constraints` porque Prisma no los declara nativamente en el
  schema.

## Prisma 7: nota de configuración

Esta versión de Prisma movió la connection string fuera de
`schema.prisma`: vive en `backend/prisma.config.ts` (para el CLI) y se pasa
como driver adapter (`@prisma/adapter-pg`) al construir `PrismaClient` en
`backend/src/prisma/prisma.service.ts`. Si ven un schema.prisma sin
`url` en el `datasource`, es intencional, no un archivo roto.
