import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Condition } from '../conditions/entities/conditions.entity';
import { ConditionsController } from './conditions.controller';
import { ConditionsRepository } from './conditions.repository';
import { ConditionsService } from './conditions.service';

@Module({
    imports: [TypeOrmModule.forFeature([Condition])],
    controllers: [ConditionsController],
    providers: [ConditionsService, ConditionsRepository],
    exports: [ConditionsService, ConditionsRepository],
})
export class ConditionsModule {}
