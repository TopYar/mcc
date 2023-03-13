import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { MeasurementPreset } from './entities/measurement-presets.entity';


@Injectable()
export class MeasurementPresetsRepository extends Repository<MeasurementPreset> {
    constructor(private dataSource: DataSource) {
        super(MeasurementPreset, dataSource.createEntityManager());
    }

    getAll({ id, conditionPresetId }: IGetAllParams) {
        const where: { [k: string]: any; } = {};

        if (id) {
            where.id = In(id);
        }

        if (conditionPresetId) {
            where.conditionPresets = { id: conditionPresetId };
        }

        return this.find({ where });
    }
}

interface IGetAllParams {
    id?: string[];
    conditionPresetId?: string;
}