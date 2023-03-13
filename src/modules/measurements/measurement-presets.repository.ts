import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { MeasurementPreset } from './entities/measurement-presets.entity';


@Injectable()
export class MeasurementPresetsRepository extends Repository<MeasurementPreset> {
    constructor(private dataSource: DataSource) {
        super(MeasurementPreset, dataSource.createEntityManager());
    }

    getAll(conditionPresetId: string) {
        return this.find({
            where: {
                conditionPresets: { id: conditionPresetId },
            },
        });
    }
}