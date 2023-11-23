// app.module.ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RateLimiterMiddleware } from './common/rate-limiter.middleware';
import { SessionMiddleware } from './common/session.middleware';
import { ErrorMiddleware } from './common/error.middleware';
import { SuccessInterceptor } from './common/success.interceptor';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URI),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy, // Add JwtStrategy to the providers
    {
      provide: APP_INTERCEPTOR,
      useClass: SuccessInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RateLimiterMiddleware, SessionMiddleware, ErrorMiddleware)
      .exclude(
        { path: 'user/register', method: RequestMethod.POST }, // Exclude rate limiting for user registration
        { path: 'user/login', method: RequestMethod.POST }, // Exclude rate limiting for user login
        { path: 'api', method: RequestMethod.GET }, // Exclude rate limiting for Swagger API documentation
      )
      .forRoutes('*');
  }
}
