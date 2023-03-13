import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { DataSource, ILike, Repository } from 'typeorm';

import { Condition } from './entities/conditions.entity';


export interface IConditionCreate {
    name: string;
    userId: string;
}

export interface IConditionGetOne {
    id: string;
    userId: string;

    attributes?: (keyof Condition)[];
}

export interface IConditionUpdate {
    id: string;
    userId: string;
    name?: string;
}

@Injectable()
export class ConditionsRepository extends Repository<Condition> {

    constructor(private dataSource: DataSource) {
        super(Condition, dataSource.createEntityManager());
    }
    async createCondition({
        name,
        userId,
    }: IConditionCreate) {
        const condition = this.create({ name, user: { id: userId } });

        return this.save(condition);
    }

    async getOne({ id, attributes }: IConditionGetOne) {
        return this.findOne({ where: { id }, select: attributes });
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