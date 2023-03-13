import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { DataSource, ILike, Repository } from 'typeorm';

import { Measurement } from './entities/measurements.entity';


@Injectable()
export class MeasurementsRepository extends Repository<Measurement> {

    constructor(private dataSource: DataSource) {
        super(Measurement, dataSource.createEntityManager());
    }
    async createMeasurement({
        userId,
        name,
        unit,
        displayTime,
    }: IMeasurementCreate) {
        const measurement = this.create({ name, unit, displayTime, user: { id: userId } });

        return this.save(measurement);
    }

    async bulkCreate(entities: IMeasurementCreate[]) {
        const instances = this.create(entities);

        return this.save(instances);
    }

    async getAll({ userId, attributes, includeMeasurementsValues }: IMeasurementsGetAll) {
        const relations: { [k: string]: any; } = {};

        if (includeMeasurementsValues) {
            relations.measurementValues = true;
        }

        return this.find({
            where: { user: { id: userId } },
            select: attributes,
            relations,
            order: {
                createdAt: 'ASC',
                measurementValues: {
                    createdAt: 'DESC',
                },
            },
        });
    }
}


export interface IMeasurementCreate {

    userId: string;
    name: string;
    unit: string;
    displayTime: boolean;
}

export interface IMeasurementsGetAll {
    userId: string;
    includeMeasurementsValues?: boolean;
    attributes?: (keyof Measurement)[];
}
