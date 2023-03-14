import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ServiceResponse, TResult } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { ConditionsService } from '../conditions/conditions.service';
import { MeasurementDto } from './dto/measurement.dto';
import { MeasurementPresetsRepository } from './measurement-presets.repository';
import { MeasurementValuesRepository } from './measurement-values.repository';
import { MeasurementsRepository } from './measurements.repository';


@Injectable()
export class MeasurementsService {
    constructor(

        @Inject(forwardRef(() => ConditionsService))
        private readonly conditionsService: ConditionsService,
        @InjectRepository(MeasurementsRepository)
        private readonly measurementsRepository: MeasurementsRepository,
        @InjectRepository(MeasurementPresetsRepository)
        private readonly measurementPresetsRepository: MeasurementPresetsRepository,
        @InjectRepository(MeasurementValuesRepository)
        private readonly measurementValuesRepository: MeasurementValuesRepository,
    ) {}

    async getOne({ id, userId, includeMeasurementsValues }: IGetOneParams) {
        const measurement = await SafeCall.call<typeof this.measurementsRepository.getOne>(
            this.measurementsRepository.getOne({
                id,
                userId,
                includeMeasurementsValues,
            }));

        if (measurement instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENT);
        }

        if (!measurement) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_MEASUREMENT_NOT_FOUND);
        }

        const result: MeasurementDto = {
            id: measurement.id,
            name: measurement.name,
            unit: measurement.unit,
            displayTime: measurement.displayTime,
            values: includeMeasurementsValues ? measurement.measurementValues.map(value => {
                return {
                    id: value.id,
                    value: value.value,
                    createdAt: value.createdAt,
                };
            }) : undefined,
        };

        return ServiceResponse.ok(result);
    }

    async createMeasurement({ name, unit, displayTime, userId }: ICreateParams): Promise<TResult<MeasurementDto>> {
        const measurement = await SafeCall.call<typeof this.measurementsRepository.createMeasurement>(
            this.measurementsRepository.createMeasurement({ user: { id: userId }, name, unit, displayTime }));

        if (measurement instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CREATE_MEASUREMENT);
        }

        return ServiceResponse.ok({
            id: measurement.id,
            name: measurement.name,
            unit: measurement.unit,
            displayTime: measurement.displayTime,
        });
    }

    async updateMeasurement({ id, name, unit, displayTime, userId }: IUpdateParams): Promise<TResult<MeasurementDto>> {
        const measurement = await SafeCall.call<typeof this.measurementsRepository.updateMeasurement>(
            this.measurementsRepository.updateMeasurement({ id }, { userId, name, unit, displayTime }));

        if (measurement instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_UPDATE_MEASUREMENT);
        }

        if (!measurement) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_MEASUREMENT_NOT_FOUND);
        }

        return ServiceResponse.ok({
            id: measurement.id,
            name: measurement.name,
            unit: measurement.unit,
            displayTime: measurement.displayTime,
        });
    }

    async getAll({ userId, includeMeasurementsValues }: IGetAllParams) {
        const measurements = await SafeCall.call<typeof this.measurementsRepository.getAll>(
            this.measurementsRepository.getAll({
                userId,
                includeMeasurementsValues,
            }));

        if (measurements instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS);
        }

        return ServiceResponse.ok(measurements.map(measurement => {
            return {
                id: measurement.id,
                name: measurement.name,
                unit: measurement.unit,
                displayTime: measurement.displayTime,
                values: includeMeasurementsValues ? measurement.measurementValues.map(value => {
                    return {
                        id: value.id,
                        value: value.value,
                        createdAt: value.createdAt,
                    };
                }) : [],
            } satisfies MeasurementDto as MeasurementDto;
        }));
    }

    async getPresets({ userId, conditionPresetId, conditionId }: IGetPresetsParams) {
        let presets: IMeasurement[] = [];
        const userTrackingMeasurements = new Set();

        if (conditionId) {
            const conditionResponse = await SafeCall.call<typeof this.conditionsService.getOne>(
                this.conditionsService.getOne({ id: conditionId, userId, includeMeasurements: true }));

            if (conditionResponse instanceof Error) {
                return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
            }

            if (!conditionResponse.success) {
                return conditionResponse;
            }

            if (conditionResponse.result.conditionPreset) {
                conditionPresetId = conditionResponse.result.conditionPreset.id;
            }

            if (conditionResponse.result.measurements.length) {
                conditionResponse.result.measurements.forEach(m => userTrackingMeasurements.add(m.id));
            }

        }

        if (conditionPresetId) {
            const presetsResponse = await SafeCall.call<typeof this.measurementPresetsRepository.getAll>(
                this.measurementPresetsRepository.getAll({ conditionPresetId }));

            if (presetsResponse instanceof Error) {
                return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS_PRESETS);
            }

            presets = presetsResponse;
        }

        const userMeasurements = await SafeCall.call<typeof this.measurementsRepository.getAll>(
            this.measurementsRepository.getAll({ userId }));

        if (userMeasurements instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS);
        }

        return ServiceResponse.ok({
            tracking: userMeasurements.map(measurement => {
                return {
                    id: measurement.id,
                    name: measurement.name,
                    unit: measurement.unit,
                    displayTime: measurement.displayTime,
                    isTracking: userTrackingMeasurements.has(measurement.id),
                } satisfies IMeasurement;
            }),
            presets: presets.filter(p => userMeasurements.findIndex(m => m.name === p.name) < 0).map(preset => {
                return {
                    id: preset.id,
                    name: preset.name,
                    unit: preset.unit,
                    displayTime: preset.displayTime,
                    isTracking: false,
                } satisfies IMeasurement;
            }),
        });
    }

    async getAllPresets(id?: string[]) {
        const presets = await SafeCall.call<typeof this.measurementPresetsRepository.getAll>(
            this.measurementPresetsRepository.getAll({ id }));

        if (presets instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS_PRESETS);
        }

        return ServiceResponse.ok(presets);
    }

    async createFromPresets(id: string[], userId: string) {
        const presets = await SafeCall.call<typeof this.measurementPresetsRepository.getAll>(
            this.measurementPresetsRepository.getAll({ id }));

        if (presets instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS_PRESETS);
        }

        const entitiesToCreate = presets.map(p => ({
            name: p.name,
            unit: p.unit,
            displayTime: p.displayTime,
            user: { id: userId },
        }));

        const measurements = await SafeCall.call<typeof this.measurementsRepository.bulkCreate>(
            this.measurementsRepository.bulkCreate(entitiesToCreate));

        if (measurements instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CREATE_MEASUREMENT);
        }

        return ServiceResponse.ok(measurements.map(m => m.id));
    }

    async addMeasurementValue({ userId, measurementId, value }: IAddMeasurementValueParams) {
        const measurementResponse = await SafeCall.call<typeof this.getOne>(
            this.getOne({ id: measurementId, userId }));

        if (measurementResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENT);
        }

        if (!measurementResponse.success) {
            return measurementResponse;
        }

        const measurementValue = await SafeCall.call<typeof this.measurementValuesRepository.createMeasurementValue>(
            this.measurementValuesRepository.createMeasurementValue({ measurementId, value }));

        if (measurementValue instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_ADD_MEASUREMENT_VALUE);
        }

        return ServiceResponse.ok({
            id: measurementValue.id,
            value: measurementValue.value,
            measurementId: measurementValue.measurement.id,
        });
    }
}

interface IGetPresetsParams {
    userId: string;
    conditionPresetId?: string;
    conditionId?: string;
}

interface IGetAllParams {
    userId: string;
    includeMeasurementsValues?: boolean;
}
interface IGetOneParams {
    id: string;
    userId: string;
    includeMeasurementsValues?: boolean;
}


interface ICreateParams {
    userId: string;
    name: string;
    unit: string;
    displayTime: boolean;
}

interface IUpdateParams {
    id: string;
    userId: string;
    name?: string;
    unit?: string;
    displayTime?: boolean;
}

interface IAddMeasurementValueParams {
    userId: string;
    measurementId: string;
    value: string;
}

interface IMeasurement {
    id: string;
    name: string;
    unit: string;
    displayTime: boolean;
    isTracking?: boolean;
}