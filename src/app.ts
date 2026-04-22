import 'reflect-metadata';
import { Controller, Get, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import helmet from 'helmet';
import { APP_FILTER } from '@nestjs/core';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AerobicsModule } from './modules/aerobics/aerobics.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './modules/auth/auth.module';
import { BootstrapModule } from './modules/bootstrap/bootstrap.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { MessagesModule } from './modules/messages/messages.module';
import { OAuthModule } from './modules/oauth/oauth.module';
import { PushModule } from './modules/push/push.module';
import { UserModule } from './modules/user/user.module';
import { VideoAnalysisModule } from './modules/video-analysis/video-analysis.module';
import { WebSocketsModule } from './modules/web-sockets/web-sockets.module';
import { WorkoutModule } from './modules/workout/workout.module';
import { BotBlockerMiddleware } from './common/middlewares/bot-blocker.middleware';
import { CheckAppVersionMiddleware } from './common/middlewares/check-app-version.middleware';
import { GeneralRateLimitMiddleware } from './common/middlewares/general-rate-limit.middleware';
import { RequestLoggerMiddleware } from './common/middlewares/request-logger.middleware';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { setupSentryErrorHandler } from './infrastructure/sentry';
import { RedisModule } from './infrastructure/redis/redis.module';
import { DBModule } from './infrastructure/db/db.module';
import { SocketIOModule } from './infrastructure/socket.io/socket.io.module';
import { AWSModule } from './infrastructure/aws/aws.module';
import { CacheModule } from './infrastructure/cache/cache.module';

let testAppPromise: Promise<NestExpressApplication> | null = null;

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
    CacheModule,
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
    abortOnError: false,
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
  if (process.env.NODE_ENV === 'test') {
    testAppPromise ??= (async () => {
      const app = await createNestApp();
      await app.init();
      return app;
    })().catch((error) => {
      testAppPromise = null;
      throw error;
    });

    return testAppPromise;
  }

  const app = await createNestApp();
  await app.init();
  return app;
};
