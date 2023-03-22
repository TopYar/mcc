import { Email, VString } from '../../../utils/validator';

export class RegisterDto {

    @VString({ empty: false, trim: true })
    name!: string;
    @Email({ normalize: true })
    email!: string;
    @VString({ pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/g })
    password!: string;
}
