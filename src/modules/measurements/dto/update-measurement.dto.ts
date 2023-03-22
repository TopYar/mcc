import { OptionalNotEmptyString } from '../../../common/helpers/validator-decorators';
import { VBoolean, VString } from '../../../utils/validator';

export class UpdateMeasurementDto {
    @VString({ empty: false })
    id!: string;
    @OptionalNotEmptyString
    name?: string;
    @OptionalNotEmptyString
    unit?: string;
    @VBoolean({ optional: true })
    displayTime?: boolean;
}