import {
    Body,
    Controller, Get, Post, Put,
    Query, Req, UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { ServiceResponse } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AddMeasurementValueDto } from './dto/add-measurement-value.dto';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { MeasurementsService } from './measurements.service';


@Controller('/measurements')
export class MeasurementsController {
    constructor(private readonly measurementsService: MeasurementsService) {}


    @UseGuards(AuthGuard)
    @Get('available')
    async getPresets(@Query() params: { conditionPresetId?: string, conditionId?: string; }, @Req() req: Request) {
        const presets = await SafeCall.call<typeof this.measurementsService.getPresets>(
            this.measurementsService.getPresets({
                userId: req.session.userId!,
                ...params,
            }),
        );

        if (presets instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS_PRESETS);
        }

        return presets;
    }

    @UseGuards(AuthGuard)
    @Get()
    async getAll(@Query() params: { id?: string; }, @Req() req: Request) {
        let response;

        if (params.id) {
            response = await SafeCall.call<typeof this.measurementsService.getOne>(
                this.measurementsService.getOne({
                    id: params.id,
                    userId: req.session.userId!,
                    // includeMeasurementsValues: true,
                }),
            );

            if (response instanceof Error) {
                return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENT);
            }
        } else {
            response = await SafeCall.call<typeof this.measurementsService.getAll>(
                this.measurementsService.getAll({
                    userId: req.session.userId!,
                    includeMeasurementsValues: true,
                }),
            );

            if (response instanceof Error) {
                return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS);
            }
        }

        return response;
    }


    @UseGuards(AuthGuard)
    @Post()
    async createMeasurement(@Body() body: CreateMeasurementDto, @Req() req: Request) {
        const response = await SafeCall.call<typeof this.measurementsService.createMeasurement>(
            this.measurementsService.createMeasurement({ userId: req.session.userId!, ...body }),
        );

        if (response instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CREATE_MEASUREMENT);
        }

        return response;
    }

    @UseGuards(AuthGuard)
    @Put()
    async updateMeasurement(@Body() body: UpdateMeasurementDto, @Req() req: Request) {
        const response = await SafeCall.call<typeof this.measurementsService.updateMeasurement>(
            this.measurementsService.updateMeasurement({ userId: req.session.userId!, ...body }),
        );

        if (response instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_UPDATE_MEASUREMENT);
        }

        return response;
    }

    @UseGuards(AuthGuard)
    @Post('values')
    async addMeasurementValue(@Body() body: AddMeasurementValueDto, @Req() req: Request) {
        const response = await SafeCall.call<typeof this.measurementsService.addMeasurementValue>(
            this.measurementsService.addMeasurementValue({ userId: req.session.userId!, ...body }),
        );

        if (response instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CREATE_MEASUREMENT);
        }

        return response;
    }
}
