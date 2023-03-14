import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { DataSource, ILike, Repository } from 'typeorm';

import { Measurement } from '../measurements/entities/measurements.entity';
import { Condition } from './entities/conditions.entity';

@Injectable()
export class ConditionsRepository extends Repository<Condition> {

    constructor(private dataSource: DataSource) {
        super(Condition, dataSource.createEntityManager());
    }
    async createCondition({
        name,
        userId,
        conditionPresetId,
        measurementIds,
    }: IConditionCreate) {
        const args: { [k: string]: any; } = {};

        if (conditionPresetId) {
            args.conditionPreset = { id: conditionPresetId };
        }

        if (measurementIds && measurementIds.length) {
            args.measurements = measurementIds.map((m: string) => ({ id: m }));
        }

        const condition = this.create({
            name,
            user: { id: userId },
            ...args,
        });

        return this.save(condition);
    }

    async getOne({ id, userId, attributes, includeMeasurements }: IConditionGetOne) {
        const relations: { [k: string]: any; } = { conditionPreset: true };

        if (includeMeasurements) {
            relations.measurements = true;
        }

        return this.findOne({
            where: { id, user: { id: userId } },
            select: attributes,
            relations,
        });
    }

    async getAll({ userId, attributes, includeMeasurements, includeMeasurementsValues, includeConditionPresets }: IConditionsGetAll) {
        const relations: { [k: string]: any; } = {};

        if (includeMeasurements) {
            relations.measurements = true;

            if (includeMeasurementsValues) {
                relations.measurements = {
                    measurementValues: true,
                };
            }
        }

        if (includeConditionPresets) {
            relations.conditionPreset = true;
        }

        return this.find({
            where: { user: { id: userId } },
            select: attributes,
            relations,
            order: {
                createdAt: 'ASC',
                measurements: {
                    createdAt: 'ASC',
                    measurementValues: {
                        createdAt: 'DESC',
                    },
                },
            },
        });
    }

    async updateCondition(condition: { id: string; }, payload: IConditionUpdate) {
        const args: { [k: string]: any; } = {};

        if (payload.name) {
            args.name = payload.name;
        }

        const conditionInstance = this.create({
            id: condition.id,
            user: { id: payload.userId },
            ...args,
        });

        return this.dataSource.transaction(async (entityManager) => {
            if (payload.bindMeasurementIds?.length) {
                await entityManager
                    .createQueryBuilder()
                    .relation(Condition, 'measurements')
                    .of({ id: condition.id })
                    .add(payload.bindMeasurementIds.map(id => ({ id })));
            }

            if (payload.unbindMeasurementIds?.length) {
                await entityManager
                    .createQueryBuilder()
                    .relation(Condition, 'measurements')
                    .of({ id: condition.id })
                    .remove(payload.unbindMeasurementIds.map(id => ({ id })));
            }

            return this.save(conditionInstance);
        });
    }
}


export interface IConditionCreate {
    name: string;
    userId: string;
    conditionPresetId?: string;
    measurementIds?: string[];
}

export interface IConditionUpdate {
    userId: string;
    name?: string;
    bindMeasurementIds?: string[];
    unbindMeasurementIds?: string[];
}

export interface IConditionGetOne {
    id: string;
    userId?: string;

    attributes?: (keyof Condition)[];
    includeMeasurements?: boolean;
}

export interface IConditionsGetAll {
    userId: string;
    includeMeasurements?: boolean;
    includeMeasurementsValues?: boolean;
    includeConditionPresets?: boolean;
    attributes?: (keyof Condition)[];
}