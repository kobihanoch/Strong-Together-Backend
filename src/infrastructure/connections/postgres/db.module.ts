import { Global, Module } from '@nestjs/common';
import { DBService } from './db.service';
import { UnitOfWork } from '../../../common/application/ports/unit-of-work.port';
import postgres from 'postgres';
import { appConfig } from '../../../config/app.config';
import { databaseConfig } from '../../../config/database.config';
import { DB_CLIENT } from './db.tokens';
import { PostgresUnitOfWork } from '../../adapters/postgres-unit-of-work';

@Global()
@Module({
  providers: [
    // Inject inside DB client
    {
      provide: DB_CLIENT,
      useFactory: () => {
        const connectionString = databaseConfig.url;
        const client: postgres.Sql = postgres(connectionString!, {
          ssl: appConfig.isProduction ? 'require' : false,
          prepare: false,
          connect_timeout: 30,
        });
        return client;
      },
    },
    DBService,
    {
      provide: UnitOfWork,
      useClass: PostgresUnitOfWork,
    },
  ],
  exports: [DBService, UnitOfWork],
})
export class DBModule {}
