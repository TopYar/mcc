import { OptionalNotEmptyString } from '../../../common/helpers/validator-decorators';
import { NestedObject } from '../../../utils/validator';
import { MeasurementsDto } from './measurements.dto';

export class CreateConditionDto {
    @OptionalNotEmptyString
    name?: string;
    @OptionalNotEmptyString
    conditionPresetId?: string;

    @NestedObject({ optional: true })
    measurements?: MeasurementsDto;
}
