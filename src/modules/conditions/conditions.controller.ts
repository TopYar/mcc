import {
    Controller, Get,
    Param, Req, UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { ServiceResponse } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ConditionsService } from './conditions.service';


@Controller('/conditions')
export class ConditionsController {
    constructor(private readonly conditionsService: ConditionsService) {}

    @UseGuards(AuthGuard)
    @Get('/:id')
    async getCondition(@Param('id') id: string, @Req() req: Request) {
        const conditionResponse = await SafeCall.call<typeof this.conditionsService.getOne>(
            this.conditionsService.getOne({ id, userId: req.session.userId }),
        );

        if (conditionResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
        }

        return conditionResponse;
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
