import { VBoolean, VString } from '../../../utils/validator';

export class CreateMeasurementDto {

    @VString({ empty: false })
    name!: string;

    @VString({ empty: false })
    unit!: string;

    @VBoolean({ optional: false })
    displayTime!: boolean;
}