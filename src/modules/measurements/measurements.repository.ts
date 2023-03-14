import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { DataSource, ILike, Repository } from 'typeorm';

import { IConditionUpdate } from '../conditions/conditions.repository';
import { Measurement } from './entities/measurements.entity';
import { MeasurementsService } from './measurements.service';


@Injectable()
export class MeasurementsRepository extends Repository<Measurement> {

    constructor(private dataSource: DataSource) {
        super(Measurement, dataSource.createEntityManager());
    }
    async createMeasurement({
        user,
        name,
        unit,
        displayTime,
    }: IMeasurementCreate) {
        const measurement = this.create({ name, unit, displayTime, user });

        return this.save(measurement);
    }

    async bulkCreate(entities: IMeasurementCreate[]) {
        const instances = this.create(entities);

        return this.save(instances);
    }

    async getOne({ id, userId, attributes, includeMeasurementsValues }: IMeasurementsGetOne) {
        const relations: { [k: string]: any; } = {};
        const order: { [k: string]: any; } = { createdAt: 'ASC' };

        if (includeMeasurementsValues) {
            relations.measurementValues = true;
            order.measurementValues = {
                createdAt: 'DESC',
            };
        }

        return this.findOne({
            where: { id, user: { id: userId } },
            select: attributes,
            relations,
            order,
        });
    }

    async getAll({ userId, attributes, includeMeasurementsValues }: IMeasurementsGetAll) {
        const relations: { [k: string]: any; } = {};
        const order: { [k: string]: any; } = { createdAt: 'ASC' };

        if (includeMeasurementsValues) {
            relations.measurementValues = true;
            order.measurementValues = {
                createdAt: 'DESC',
            };
        }

        return this.find({
            where: { user: { id: userId } },
            select: attributes,
            relations,
            order,
        });
    }

    async updateMeasurement(measurement: { id: string; }, payload: IMeasurementUpdate) {
        const args: { [k: string]: any; } = {};

        if (payload.name) {
            args.name = payload.name;
        }

        if (payload.unit) {
            args.unit = payload.unit;
        }

        if (payload.displayTime !== undefined) {
            args.displayTime = payload.displayTime;
        }


        if (!_.isEmpty(args)) {
            const measurementInstance = this.create({
                id: measurement.id,
                user: { id: payload.userId },
                ...args,
            });

            const measurementResult = await this.createQueryBuilder()
                .update(Measurement)
                .set(measurementInstance)
                .where({ id: measurement.id, user: { id: payload.userId } })
                .returning('*')
                .execute();

            if (measurementResult.raw.length) {
                Object.assign(measurement, measurementResult.raw[0]);
            }

            return measurementResult.raw[0];
        }
    }
    async deleteMeasurement({ id, userId }: IMeasurementDelete) {
        return this.createQueryBuilder()
            .softDelete()
            .from(Measurement)
            .where({ id: id, user: { id: userId } })
            .execute();
    }
}


export interface IMeasurementCreate {
    user: { id: string; };
    name: string;
    unit: string;
    displayTime: boolean;
}

export interface IMeasurementsGetAll {
    userId: string;
    includeMeasurementsValues?: boolean;
    attributes?: (keyof Measurement)[];
}

export interface IMeasurementsGetOne {
    id: string;
    userId: string;
    includeMeasurementsValues?: boolean;
    attributes?: (keyof Measurement)[];
}

export interface IMeasurementUpdate {
    userId: string;
    name?: string;
    unit?: string;
    displayTime?: boolean;
}

export interface IMeasurementDelete {
    id: string;
    userId: string;
}
