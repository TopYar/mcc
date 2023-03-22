import { VString } from '../../../utils/validator';

export class ConfirmDto {
    @VString({ length: 4, numeric: true })
    code!: string;
}
