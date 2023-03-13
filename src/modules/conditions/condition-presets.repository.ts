import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { IConditionGetOne } from './conditions.repository';
import { ConditionPreset } from './entities/condition-presets.entity';

@Injectable()
export class ConditionPresetsRepository extends Repository<ConditionPreset> {

    constructor(private dataSource: DataSource) {
        super(ConditionPreset, dataSource.createEntityManager());
    }

    async getOne(id: string) {
        return this.findOne({
            where: { id },
        });
    }
}
