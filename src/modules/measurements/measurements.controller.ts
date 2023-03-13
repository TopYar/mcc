import {
    Controller, Get,
    Param, Req, UseGuards,
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


    // @Get('presets')
    // async getPresets(@Req() req: Request) {
    //     const condition = await SafeCall.call<typeof this.conditionsService.getOne>(
    //         this.conditionsService.getOne({ id, userId: req.session.userId }),
    //     );
    //
    //     if (condition instanceof Error) {
    //         return ServiceResponse.fail(ServiceResponse.CODES.FAIL_CONDITION_NOT_FOUND);
    //     }
    //
    //     return this.conditionsService.getOne({ id, userId: req.session.userId! });
    // }
}
