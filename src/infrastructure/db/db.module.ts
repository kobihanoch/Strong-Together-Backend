import { Global, Module } from '@nestjs/common';
import { DBService } from './db.service.ts';
import postgres from 'postgres';
import { appConfig } from '../../config/app.config.ts';
import { databaseConfig } from '../../config/database.config.ts';
import { DB_CLIENT, SQL } from './db.tokens.ts';

@Global()
@Module({
  providers: [
    // Inject inside DB client
    {
      provide: DB_CLIENT,
      useFactory: () => {
        const connectionString = databaseConfig.url;
        return postgres(connectionString!, {
          ssl: appConfig.isTest ? false : 'require',
          prepare: false,
          connect_timeout: 30,
        });
      },
    },
    DBService,
    // Assign sql instance to SQL tag for wide usage
    {
      provide: SQL,
      useFactory: (dbService: DBService) => dbService.sql,
      inject: [DBService],
    },
  ],
  exports: [DBService, SQL],
})
export class DBModule {}
