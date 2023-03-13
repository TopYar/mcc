import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConditionPresetsRepository } from './condition-presets.repository';
import { ConditionsController } from './conditions.controller';
import { ConditionsRepository } from './conditions.repository';
import { ConditionsService } from './conditions.service';
import { ConditionPreset } from './entities/condition-presets.entity';
import { Condition } from './entities/conditions.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Condition, ConditionPreset])],
    controllers: [ConditionsController],
    providers: [ConditionsService, ConditionsRepository, ConditionPresetsRepository],
    exports: [ConditionsService],
})
export class ConditionsModule {}
