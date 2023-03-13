import {
    Controller, Get,
    Param,
} from '@nestjs/common';

import { ConditionsService } from './conditions.service';

@Controller('/users')
export class ConditionsController {
    constructor(private readonly conditionsService: ConditionsService) {}

    //
    // @Get('/:id')
    // getUser(@Param('id') id: string) {
    //     return this.conditionsService.getOne({ id });
    // }
}
