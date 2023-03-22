import { VString } from '../../../utils/validator';

export class SetPasswordDto {
    @VString({ pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/g })
    password!: string;
}
