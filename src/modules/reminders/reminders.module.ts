import { Module } from '@nestjs/common';
import { RemindersController } from './reminders.controller';
import { RemindersQueries } from './reminders.queries';
import { RemindersService } from './reminders.service';

@Module({
  controllers: [RemindersController],
  providers: [RemindersService, RemindersQueries],
})
export class RemindersModule {}
