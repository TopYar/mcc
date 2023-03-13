import {
    Controller, Get, Query,
    Req, UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { ServiceResponse } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { AuthGuard } from '../auth/guards/auth.guard';
import { MeasurementsService } from './measurements.service';


@Controller('/measurements')
export class MeasurementsController {
    constructor(private readonly measurementsService: MeasurementsService) {}


    @UseGuards(AuthGuard)
    @Get('available')
    async getPresets(@Query() params: { conditionPresetId?: string; }, @Req() req: Request) {
        const presets = await SafeCall.call<typeof this.measurementsService.getPresets>(
            this.measurementsService.getPresets(req.session.userId!, params.conditionPresetId),
        );

        if (presets instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS_PRESETS);
        }

        return presets;
    }

    @UseGuards(AuthGuard)
    @Get()
    async getAll(@Req() req: Request) {
        const response = await SafeCall.call<typeof this.measurementsService.getAll>(
            this.measurementsService.getAll({
                userId: req.session.userId!,
                includeMeasurementsValues: true,
            }),
        );

        if (response instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS);
        }

        return response;
    }
}
