import {
    Controller, Get, Query,
    Req, UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { ELang } from '../../common/helpers/lang';
import { ServiceResponse } from '../../common/ServiceResponse';
import { SafeCall } from '../../utils/safeCall';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ConditionsService } from '../conditions/conditions.service';
import { Condition } from '../conditions/entities/conditions.entity';
import { MeasurementDto } from '../measurements/dto/measurement.dto';


@Controller('/dashboard')
export class DashboardController {
    constructor(private readonly conditionsService: ConditionsService) {}

    @UseGuards(AuthGuard)
    @Get()
    async getDashboard(@Req() req: Request, @Query() params: { lang?: ELang; }) {
        const conditionResponse = await SafeCall.call<typeof this.conditionsService.getAll>(
            this.conditionsService.getAll({
                userId: req.session.userId!,
                includeMeasurements: true,
                includeMeasurementsValues: true,
                includeConditionPresets: true,
            }),
        );

        if (conditionResponse instanceof Error) {
            return ServiceResponse.fail(ServiceResponse.CODES.FAIL_GET_CONDITION);
        }

        if (!conditionResponse.success) {
            return conditionResponse;
        }

        const diet = this.calculateDiet(conditionResponse.result, params.lang);

        const result: DashboardDto = {
            conditions: conditionResponse.result.map(condition => {
                return {
                    id: condition.id,
                    name: condition.name,
                    measurements: condition.measurements.map(measurement => {
                        return {
                            id: measurement.id,
                            name: measurement.name,
                            unit: measurement.unit,
                            displayTime: measurement.displayTime,
                            values: measurement.measurementValues.slice(0, 3).map(value => {
                                return {
                                    id: value.id,
                                    value: value.value,
                                    createdAt: value.createdAt,
                                };
                            }),
                        };
                    }),
                };
            }),
            diet: {
                forbidden: Array.from(diet.forbidden.values()),
                limited: Array.from(diet.limited.values()),
                recommended: Array.from(diet.recommended.values()),
            },
        };

        return ServiceResponse.ok(result);
    }

    calculateDiet(conditions: Condition[], lang: ELang = ELang.en) {
        return conditions.reduce((diet, condition) => {
            if (condition.conditionPreset) {
                const recommended = lang === ELang.en ?
                    condition.conditionPreset.recommended :
                    condition.conditionPreset[`recommended_${lang}`] ?? [];
                const limited = lang === ELang.en ?
                    condition.conditionPreset.limited :
                    condition.conditionPreset[`limited_${lang}`] ?? [];
                const forbidden = lang === ELang.en ?
                    condition.conditionPreset.forbidden :
                    condition.conditionPreset[`forbidden_${lang}`] ?? [];

                for (const el of recommended) {
                    if (diet.forbidden.has(el)) {
                        continue;
                    }

                    if (diet.limited.has(el)) {
                        continue;
                    }

                    diet.recommended.add(el);
                }

                for (const el of limited) {
                    if (diet.forbidden.has(el)) {
                        continue;
                    }

                    if (diet.recommended.has(el)) {
                        diet.recommended.delete(el);
                    }

                    diet.limited.add(el);
                }

                for (const el of forbidden) {
                    if (diet.recommended.has(el)) {
                        diet.recommended.delete(el);
                    }

                    if (diet.limited.has(el)) {
                        diet.limited.delete(el);
                    }

                    diet.forbidden.add(el);
                }
            }

            return diet;
        }, { recommended: new Set(), limited: new Set(), forbidden: new Set() } as IDiet);
    }
}

interface DashboardDto {
    conditions: {
        id: string,
        name: string,
        measurements: MeasurementDto[];
    }[];

    diet: {
        recommended: string[],
        limited: string[],
        forbidden: string[],
    };
}

interface IDiet {
    recommended: Set<string>,
    limited: Set<string>,
    forbidden: Set<string>,
}