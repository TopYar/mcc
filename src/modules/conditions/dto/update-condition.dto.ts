import { OptionalNotEmptyString } from '../../../common/helpers/validator-decorators';
import { NestedObject, VString } from '../../../utils/validator';
import { MeasurementsDto } from './measurements.dto';

export class UpdateConditionDto {
    @VString({ empty: false })
    id!: string;
    @OptionalNotEmptyString
    name?: string;

    @NestedObject({ optional: true })
    measurements?: MeasurementsDto;
}
