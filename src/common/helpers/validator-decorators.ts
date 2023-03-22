import { VString } from '../../utils/validator';

export const OptionalNotEmptyString = VString({ empty: false, optional: true });