import {
    Controller, Get,
    Param, Req, UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthGuard } from '../auth/guards/auth.guard';
import { ConditionsService } from './conditions.service';

@Controller('/conditions')
export class ConditionsController {
    constructor(private readonly conditionsService: ConditionsService) {}


    // @UseGuards(AuthGuard)
    // @Get('/:id')
    // getCondition(@Param('id') id: string, @Req() req: Request) {
    //     return this.conditionsService.getOne({ id, userId: req.session.userId! });
    // }
}
