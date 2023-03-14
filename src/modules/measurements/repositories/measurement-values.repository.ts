import { Injectable } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';

import { MeasurementValue } from '../entities/measurement-values.entity';
import { Measurement } from '../entities/measurements.entity';


@Injectable()
export class MeasurementValuesRepository extends Repository<MeasurementValue> {

    constructor(private dataSource: DataSource) {
        super(MeasurementValue, dataSource.createEntityManager());
    }
    async createMeasurementValue({
        measurementId,
        value,
    }: IMeasurementValueCreate) {
        const measurement = this.create({ value, measurement: { id: measurementId } });

        return this.save(measurement);
    }

    async deleteMeasurement({ id, measurementId }: IMeasurementValueDelete) {
        return this.createQueryBuilder()
            .softDelete()
            .from(MeasurementValue)
            .where({ id: id, measurement: { id: measurementId } })
            .execute();
    }
}


export interface IMeasurementValueCreate {
    measurementId: string;
    value: string;
}

interface IMeasurementValueDelete {
    id: string;
    measurementId: string;
}