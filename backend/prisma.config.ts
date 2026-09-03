import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // `env()` de prisma/config corta la build si la variable no existe, pero
    // `prisma generate` corre en la imagen de Docker sin .env (está en
    // .dockerignore a propósito) y no necesita una URL real para generar
    // el client. migrate/db necesitan el valor real, que sí está seteado en
    // tiempo de ejecución (docker-compose.yml o .env local).
    url: process.env.DATABASE_URL ?? 'postgresql://user:pass@localhost:5432/db',
  },
});
