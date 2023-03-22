import { OptionalNotEmptyString } from '../../../common/helpers/validator-decorators';
import { VString } from '../../../utils/validator';

export class UpdateMeasurementDto {
    @VString({ empty: false })
    id!: string;
    @OptionalNotEmptyString
    name?: string;
    @OptionalNotEmptyString
    unit?: string;
    @OptionalNotEmptyString
    displayTime?: boolean;
}