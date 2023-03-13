import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ServiceResponse, TResult } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { MeasurementDto } from './dto/measurement.dto';
import { MeasurementPresetsRepository } from './measurement-presets.repository';
import { MeasurementsRepository } from './measurements.repository';


@Injectable()
export class MeasurementsService {
    constructor(
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

    async getPresets(userId: string, conditionPresetId: string) {
        const presets = await SafeCall.call<typeof this.measurementPresetsRepository.getAll>(
            this.measurementPresetsRepository.getAll(conditionPresetId));

        if (presets instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS_PRESETS);
        }

        const userMeasurements = await SafeCall.call<typeof this.measurementsRepository.getAll>(
            this.measurementsRepository.getAll({ userId }));

        if (userMeasurements instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS);
        }

        return ServiceResponse.ok({
            tracking: userMeasurements.map(measurement => ({
                id: measurement.id,
                name: measurement.name,
                unit: measurement.unit,
                displayTime: measurement.displayTime,
            })),
            presets: presets.filter(p => userMeasurements.findIndex(m => m.name === p.name) < 0).map(preset => {
                return {
                    id: preset.id,
                    name: preset.name,
                    unit: preset.unit,
                    displayTime: preset.displayTime,
                };
            }),
        });
    }
}


interface IGetAllParams {
    userId: string;
    includeMeasurementsValues?: boolean;
}