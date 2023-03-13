import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { DataSource, ILike, Repository } from 'typeorm';

import { MeasurementValue } from './entities/measurement-values.entity';
import { Measurement } from './entities/measurements.entity';


@Injectable()
export class MeasurementValuesRepository extends Repository<MeasurementValue> {

    constructor(private dataSource: DataSource) {
        super(Measurement, dataSource.createEntityManager());
    }
    async createMeasurementValue({
        measurementId,
        value,
    }: IMeasurementCreate) {
        const measurement = this.create({ value, measurement: { id: measurementId } });

        return this.save(measurement);
    }
}


export interface IMeasurementCreate {
    measurementId: string;
    value: string;
}