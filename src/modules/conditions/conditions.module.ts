import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConditionsController } from './conditions.controller';
import { ConditionsRepository } from './conditions.repository';
import { ConditionsService } from './conditions.service';
import { Condition } from './entities/conditions.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Condition])],
    controllers: [ConditionsController],
    providers: [ConditionsService, ConditionsRepository],
    exports: [ConditionsService],
})
export class ConditionsModule {}
