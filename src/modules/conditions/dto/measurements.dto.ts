import { ArrayOf } from '../../../utils/validator';

export class MeasurementsDto {
    @ArrayOf({ items: { type: 'string', empty: false }, optional: true })
    tracking?: string[];
    @ArrayOf({ items: { type: 'string', empty: false }, optional: true })
    presets?: string[];
}