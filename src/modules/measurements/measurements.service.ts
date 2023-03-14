import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ServiceResponse, TResult } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { ConditionsService } from '../conditions/conditions.service';
import { MeasurementDto } from './dto/measurement.dto';
import { MeasurementPresetsRepository } from './measurement-presets.repository';
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
    ) {}

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
                values: measurement.measurementValues.map(value => {
                    return {
                        id: value.id,
                        value: value.value,
                        createdAt: value.createdAt,
                    };
                }),
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
            userId,
        }));

        const measurements = await SafeCall.call<typeof this.measurementsRepository.bulkCreate>(
            this.measurementsRepository.bulkCreate(entitiesToCreate));

        if (measurements instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CREATE_MEASUREMENT);
        }

        return ServiceResponse.ok(measurements.map(m => m.id));
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

interface IMeasurement {
    id: string;
    name: string;
    unit: string;
    displayTime: boolean;
    isTracking?: boolean;
}