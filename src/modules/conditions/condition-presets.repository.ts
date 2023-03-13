import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ConditionPreset } from './entities/condition-presets.entity';

@Injectable()
export class ConditionPresetsRepository extends Repository<ConditionPreset> {

    constructor(private dataSource: DataSource) {
        super(ConditionPreset, dataSource.createEntityManager());
    }
}
