import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ServiceResponse, TResult } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { MeasurementsService } from '../measurements/measurements.service';
import { ConditionPresetsRepository } from './condition-presets.repository';
import { ConditionsRepository, IConditionCreate, IConditionGetOne, IConditionUpdate } from './conditions.repository';
import { CreateConditionDto } from './dto/create-condition.dto';
import { ConditionPreset } from './entities/condition-presets.entity';
import { Condition } from './entities/conditions.entity';


@Injectable()
export class ConditionsService {
    constructor(
        @InjectRepository(ConditionsRepository)
        private readonly conditionsRepository: ConditionsRepository,
        @InjectRepository(ConditionPresetsRepository)
        private readonly conditionPresetsRepository: ConditionPresetsRepository,


        @Inject(forwardRef(() => MeasurementsService))
        private readonly measurementsService: MeasurementsService,
    ) {}

    async createCondition({ userId, name, conditionPresetId, measurements }: ICreateParams) {
        if (!name && !conditionPresetId) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
        }

        const args: any = { userId };

        if (conditionPresetId) {
            const conditionPreset: ConditionPreset | null | Error = await SafeCall.call<typeof this.conditionPresetsRepository.getOne>(
                this.conditionPresetsRepository.getOne(conditionPresetId));

            if (conditionPreset instanceof Error) {
                return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION_PRESETS);
            }

            if (!conditionPreset) {
                return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CONDITION_PRESET_NOT_FOUND);
            }

            args.conditionPresetId = conditionPreset.id;
            args.name = conditionPreset.name;
        } else {
            args.name = name;
        }

        if (measurements) {
            let bindMeasurementIds: string[] = [];

            if (measurements.presets) {
                const presetsResponse = await SafeCall.call<typeof this.measurementsService.createFromPresets>(
                    this.measurementsService.createFromPresets(measurements.presets, userId));

                if (presetsResponse instanceof Error) {
                    return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CREATE_MEASUREMENT);
                }

                if (!presetsResponse.success) {
                    return presetsResponse;
                }

                bindMeasurementIds = bindMeasurementIds.concat(presetsResponse.result);
            }

            if (measurements.tracking) {
                bindMeasurementIds = bindMeasurementIds.concat(measurements.tracking);
            }

            args.measurementIds = bindMeasurementIds;
        }

        const condition = await SafeCall.call<typeof this.conditionsRepository.createCondition>(
            this.conditionsRepository.createCondition(args));

        if (condition instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CREATE_CONDITION);
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

    async getOne(args: IGetOneParams) {
        const condition = await SafeCall.call<typeof this.conditionsRepository.getOne>(
            this.conditionsRepository.getOne({ ...args }));

        if (condition instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
        }

        if (!condition) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CONDITION_NOT_FOUND);
        }

        return ServiceResponse.ok({
            id: condition.id,
            name: condition.name,
            conditionPreset: condition.conditionPreset,
            measurements: condition.measurements,
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

interface ICreateParams {
    name?: string;
    conditionPresetId?: string;
    measurements?: {
        tracking?: string[];
        presets?: string[];
    };
    userId: string;
}

interface IGetOneParams {
    id: string;
    userId?: string;

    attributes?: (keyof Condition)[];

    includeMeasurements?: boolean;
}

interface IGetAllParams {
    userId: string;
    includeMeasurements?: boolean;
    includeMeasurementsValues?: boolean;
    includeConditionPresets?: boolean;
}