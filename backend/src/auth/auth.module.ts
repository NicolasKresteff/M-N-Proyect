import { Module } from '@nestjs/common';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    // `.register()` es necesario: PassportModule "pelado" no provee
    // AuthModuleOptions, que es lo que JwtAuthGuard (AuthGuard('jwt'))
    // necesita inyectar en cada módulo donde se usa @UseGuards(JwtAuthGuard).
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ({
          secret: config.get<string>('JWT_SECRET') ?? 'dev-secret',
          // El tipo de expiresIn en @nestjs/jwt exige el literal `StringValue`
          // de la lib `ms` en vez de `string` genérico; el valor viene de env
          // así que no podemos tipar más estricto que esto sin acoplarnos a esa lib.
          signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '1d' },
        }) as JwtModuleOptions,
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  // PassportModule se re-exporta porque JwtAuthGuard (usado en el resto de
  // los módulos vía @UseGuards) depende de él para resolver AuthModuleOptions.
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
