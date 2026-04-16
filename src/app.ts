import 'reflect-metadata';
import { Controller, Get, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import helmet from 'helmet';
import { APP_FILTER } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AerobicsModule } from './modules/aerobics/aerobics.module.ts';
import { AnalyticsModule } from './modules/analytics/analytics.module.ts';
import { AuthModule } from './modules/auth/auth.module.ts';
import { BootstrapModule } from './modules/bootstrap/bootstrap.module.ts';
import { ExercisesModule } from './modules/exercises/exercises.module.ts';
import { MessagesModule } from './modules/messages/messages.module.ts';
import { OAuthModule } from './modules/oauth/oauth.module.ts';
import { PushModule } from './modules/push/push.module.ts';
import { UserModule } from './modules/user/user.module.ts';
import { VideoAnalysisModule } from './modules/video-analysis/video-analysis.module.ts';
import { WebSocketsModule } from './modules/web-sockets/web-sockets.module.ts';
import { WorkoutModule } from './modules/workout/workout.module.ts';
import { BotBlockerMiddleware } from './common/middlewares/bot-blocker.middleware.ts';
import { CheckAppVersionMiddleware } from './common/middlewares/check-app-version.middleware.ts';
import { GeneralRateLimitMiddleware } from './common/middlewares/general-rate-limit.middleware.ts';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware.ts';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.ts';
import { setupSentryErrorHandler } from './infrastructure/sentry.ts';
import { RedisModule } from './infrastructure/redis/redis.module.ts';
import { DBModule } from './infrastructure/db/db.module.ts';
import { SocketIOModule } from './infrastructure/socket.io/socket.io.module.ts';
import { AWSModule } from './infrastructure/aws/aws.module.ts';

@Controller()
class AppController {
  @Get()
  root() {
    return 'Server is running...';
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}

@Module({
  imports: [
    RedisModule,
    DBModule,
    SocketIOModule,
    AWSModule,
    AerobicsModule,
    AnalyticsModule,
    AuthModule,
    BootstrapModule,
    ExercisesModule,
    MessagesModule,
    OAuthModule,
    PushModule,
    UserModule,
    VideoAnalysisModule,
    WebSocketsModule,
    WorkoutModule,
  ],
  controllers: [AppController],
  providers: [
    GlobalExceptionFilter,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    GeneralRateLimitMiddleware,
    RequestLoggerMiddleware,
    BotBlockerMiddleware,
    CheckAppVersionMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(GeneralRateLimitMiddleware, RequestLoggerMiddleware, BotBlockerMiddleware, CheckAppVersionMiddleware)
      .forRoutes('*');
  }
}

export const createNestApp = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false,
  });

  app.enableCors({
    origin: ['https://strongtogether.kobihanoch.com'],
    methods: ['POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  app.use(helmet());
  app.set('trust proxy', 1);

  setupSentryErrorHandler(app.getHttpAdapter().getInstance());

  return app;
};

export const createApp = async (): Promise<NestExpressApplication> => {
  const app = await createNestApp();
  await app.init();
  return app;
};
