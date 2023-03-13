import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ServiceResponse, TResult } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { MeasurementDto } from './dto/measurement.dto';
import { MeasurementsRepository } from './measurements.repository';


@Injectable()
export class MeasurementsService {
    constructor(
        @InjectRepository(MeasurementsRepository)
        private readonly measurementsRepository: MeasurementsRepository,
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
}


interface IGetAllParams {
    userId: string;
    includeMeasurementsValues?: boolean;
}