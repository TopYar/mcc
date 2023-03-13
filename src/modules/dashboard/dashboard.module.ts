import { Module } from '@nestjs/common';

import { ConditionsModule } from '../conditions/conditions.module';
import { DashboardController } from './dashboard.controller';

@Module({
    imports: [ConditionsModule],
    controllers: [DashboardController],
})
export class DashboardModule {}
