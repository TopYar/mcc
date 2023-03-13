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

    @Get('presets')
    async getPresets(@Req() req: Request) {
        const presets = await SafeCall.call<typeof this.conditionsService.getPresets>(
            this.conditionsService.getPresets(),
        );

        if (presets instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION_PRESETS);
        }

        return presets;
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getCondition(@Param('id') id: string, @Req() req: Request) {
        const conditionResponse = await SafeCall.call<typeof this.conditionsService.getOne>(
            this.conditionsService.getOne({ id, userId: req.session.userId }),
        );

        if (conditionResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
        }

        return conditionResponse;
    }
}
