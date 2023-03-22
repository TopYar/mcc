import { VString } from '../../utils/validator';
import { OptionalNotEmptyString } from '../helpers/validator-decorators';

export class IdParams {
    @VString({ empty: false })
    id!: string;
}
export class IdOptionalParams {
    @OptionalNotEmptyString
    id?: string;
}