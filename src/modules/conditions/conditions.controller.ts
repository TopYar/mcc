import {
    Body, Controller, forwardRef,
    Get, Inject, Param, Post, Put, Query,
    Req, UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { ServiceResponse } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { AuthGuard } from '../auth/guards/auth.guard';
import { MeasurementsService } from '../measurements/measurements.service';
import { ConditionsService } from './conditions.service';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';


@Controller('/conditions')
export class ConditionsController {
    constructor(
        private readonly conditionsService: ConditionsService,

        @Inject(forwardRef(() => MeasurementsService))
        private readonly measurementsService: MeasurementsService) {}

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
    @Get()
    async getCondition(@Query() params: { id: string; }, @Req() req: Request) {
        const conditionResponse = await SafeCall.call<typeof this.conditionsService.getOne>(
            this.conditionsService.getOne({ id: params.id, userId: req.session.userId }),
        );

        if (conditionResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
        }

        if (!conditionResponse.success) {
            return conditionResponse;
        }

        const presetsResponse = await SafeCall.call<typeof this.measurementsService.getPresets>(
            this.measurementsService.getPresets({
                userId: req.session.userId!,
                conditionId: params.id,
            }),
        );

        if (presetsResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_MEASUREMENTS_PRESETS);
        }

        if (!presetsResponse.success) {
            return presetsResponse;
        }

        const conditionInstance = conditionResponse.result;

        return ServiceResponse.ok({
            id: conditionInstance.id,
            name: conditionInstance.name,
            createdAt: conditionInstance.createdAt,
            updatedAt: conditionInstance.updatedAt,
            ...presetsResponse.result,
        });
    }

    @UseGuards(AuthGuard)
    @Post()
    async createCondition(@Body() body: CreateConditionDto, @Req() req: Request) {
        const conditionResponse = await SafeCall.call<typeof this.conditionsService.createCondition>(
            this.conditionsService.createCondition({
                ...body,
                userId: req.session.userId!,
            }),
        );

        if (conditionResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
        }

        return conditionResponse;
    }

    @UseGuards(AuthGuard)
    @Put()
    async updateCondition(@Body() body: UpdateConditionDto, @Req() req: Request) {
        const conditionResponse = await SafeCall.call<typeof this.conditionsService.updateCondition>(
            this.conditionsService.updateCondition({
                ...body,
                userId: req.session.userId!,
            }),
        );

        if (conditionResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
        }

        return conditionResponse;
    }
}
