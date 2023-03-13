import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { DataSource, ILike, Repository } from 'typeorm';

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
    }: IConditionCreate) {
        const condition = this.create({ name, user: { id: userId }, conditionPreset: { id: conditionPresetId } });

        return this.save(condition);
    }

    async getOne({ id, userId, attributes, loadRelationIds }: IConditionGetOne) {
        return this.findOne({
            where: { id, user: { id: userId } },
            select: attributes,
            relations: { conditionPreset: true },
            loadRelationIds,
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

        if (!_.isEmpty(args)) {
            const conditionInstance = this.create({ id: condition.id, ...args });
            const conditionResult = await this.createQueryBuilder()
                .update(Condition)
                .set(conditionInstance)
                .where({ id: condition.id, userId: payload.userId })
                .returning('*')
                .execute();

            if (conditionResult.raw.length) {
                Object.assign(condition, conditionResult.raw[0]);
            }
        }
    }
}


export interface IConditionCreate {
    name: string;
    userId: string;
    conditionPresetId?: string;
}

export interface IConditionGetOne {
    id: string;
    userId?: string;

    attributes?: (keyof Condition)[];
    loadRelationIds?: boolean;
}

export interface IConditionsGetAll {
    userId: string;
    includeMeasurements?: boolean;
    includeMeasurementsValues?: boolean;
    includeConditionPresets?: boolean;
    attributes?: (keyof Condition)[];
}

export interface IConditionUpdate {
    id: string;
    userId: string;
    name?: string;
}