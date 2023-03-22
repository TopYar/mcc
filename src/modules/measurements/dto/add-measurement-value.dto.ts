import { VString } from '../../../utils/validator';

export class AddMeasurementValueDto {
    @VString({ empty: false })
    measurementId!: string;

    @VString({ empty: false })
    value!: string;
}