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
            return ServiceResponse.fail(ServiceResponse.CODES.ERROR_NAME_OR_PRESET_ID_REQUIRED);
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
            createdAt: condition.createdAt,
            updatedAt: condition.createdAt,
        });
    }
    async updateCondition({ id, userId, name, measurements }: IUpdateParams) {
        const args: any = { userId, name };

        const userTrackingMeasurementNames = new Set();
        const userTrackingMeasurementIds = new Set();

        // Get condition with tracking measurements
        const conditionResponse = await SafeCall.call<typeof this.getOne>(
            this.getOne({ id, userId, includeMeasurements: true }));

        if (conditionResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
        }

        if (!conditionResponse.success) {
            return conditionResponse;
        }

        const conditionInstance = conditionResponse.result;

        if (conditionInstance.conditionPreset) {
            args.name = conditionInstance.conditionPreset.name;
        }

        if (conditionInstance.measurements.length) {
            conditionInstance.measurements.forEach(m => {
                userTrackingMeasurementIds.add(m.id);
            });
        }

        const userMeasurementsResponse = await SafeCall.call<typeof this.measurementsService.getAll>(
            this.measurementsService.getAll({ userId }));

        if (userMeasurementsResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS);
        }

        if (!userMeasurementsResponse.success) {
            return userMeasurementsResponse;
        }

        const userMeasurements = userMeasurementsResponse.result;

        if (userMeasurements.length) {
            userMeasurements.map(m => {
                userTrackingMeasurementNames.add(m.name);
            });
        }

        if (measurements) {
            let bindMeasurementIds: string[] = [];
            let unbindMeasurementIds: string[] = [];

            if (measurements.presets) {
                const chosenPresetsResponse = await SafeCall.call<typeof this.measurementsService.getAllPresets>(
                    this.measurementsService.getAllPresets(measurements.presets));

                if (chosenPresetsResponse instanceof Error) {
                    return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS_PRESETS);
                }

                if (!chosenPresetsResponse.success) {
                    return chosenPresetsResponse;
                }

                // const chosenPresets = new Set(chosenPresetsResponse.result.map(p => p.id));
                const chosenPresets = chosenPresetsResponse.result;
                const presetsToCreate = chosenPresets
                    .filter(p => !userTrackingMeasurementNames.has(p.name))
                    .map(p => p.id);

                const presetsResponse = await SafeCall.call<typeof this.measurementsService.createFromPresets>(
                    this.measurementsService.createFromPresets(presetsToCreate, userId));

                if (presetsResponse instanceof Error) {
                    return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CREATE_MEASUREMENT);
                }

                if (!presetsResponse.success) {
                    return presetsResponse;
                }

                bindMeasurementIds = bindMeasurementIds.concat(presetsResponse.result);
            }

            if (measurements.tracking) {
                bindMeasurementIds = bindMeasurementIds.concat(
                    // Add only newly checked measurements for tracking
                    measurements.tracking.filter(m => !userTrackingMeasurementIds.has(m)),
                );

                unbindMeasurementIds = unbindMeasurementIds.concat(
                    // Unbind all options that were unchecked
                    conditionInstance.measurements
                        .filter(m => !measurements.tracking!.includes(m.id))
                        .map(m => m.id),
                );
            }

            args.bindMeasurementIds = bindMeasurementIds;
            args.unbindMeasurementIds = unbindMeasurementIds;
        }

        const updateResult = await SafeCall.call<typeof this.conditionsRepository.updateCondition>(
            this.conditionsRepository.updateCondition(conditionInstance, args));

        if (updateResult instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_UPDATE_CONDITION);
        }

        return ServiceResponse.ok({
            id: conditionInstance.id,
            name: conditionInstance.name,
            createdAt: conditionInstance.createdAt,
            updatedAt: conditionInstance.createdAt,
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

interface IUpdateParams {
    id: string;
    userId: string;
    name?: string;
    measurements?: {
        tracking?: string[];
        presets?: string[];
    };
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