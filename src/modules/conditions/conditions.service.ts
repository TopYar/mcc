import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ServiceResponse, TResult } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { ConditionPresetsRepository } from './condition-presets.repository';
import { ConditionsRepository, IConditionGetOne, IConditionUpdate } from './conditions.repository';


@Injectable()
export class ConditionsService {
    constructor(
        @InjectRepository(ConditionsRepository)
        private readonly conditionsRepository: ConditionsRepository,
        @InjectRepository(ConditionPresetsRepository)
        private readonly conditionPresetsRepository: ConditionPresetsRepository,
    ) {}

    async getOne(args: IGetOneParams) {
        const condition = await SafeCall.call<typeof this.conditionsRepository.getOne>(
            this.conditionsRepository.getOne({ ...args, loadRelationIds: true }));

        if (condition instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
        }

        if (!condition) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CONDITION_NOT_FOUND);
        }

        return ServiceResponse.ok({
            id: condition.id,
            name: condition.name,
            conditionPresetId: condition.conditionPreset,
            createdAt: condition.createdAt,
            updatedAt: condition.createdAt,
        });
    }

    async getAll({ userId, includeMeasurements, includeMeasurementsValues, includeConditionPresets }: IGetAllParams) {
        const conditions = await SafeCall.call<typeof this.conditionsRepository.getAll>(
            this.conditionsRepository.getAll({
                userId,
                includeConditionPresets,
                includeMeasurements,
                includeMeasurementsValues,
            }));

        if (conditions instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
        }

        if (!conditions) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CONDITION_NOT_FOUND);
        }

        return ServiceResponse.ok(conditions);
    }

    async getPresets() {
        const presets = await SafeCall.call<typeof this.conditionPresetsRepository.find>(
            this.conditionPresetsRepository.find());

        if (presets instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION_PRESETS);
        }

        return ServiceResponse.ok(presets.map(preset => ({
            id: preset.id,
            name: preset.name,
        })));
    }
}

interface IGetOneParams {
    id: string;
    userId?: string;
}

interface IGetAllParams {
    userId: string;
    includeMeasurements?: boolean;
    includeMeasurementsValues?: boolean;
    includeConditionPresets?: boolean;
}