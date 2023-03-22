import { Email, VString } from '../../../utils/validator';

export class LoginDto {
    @Email({ normalize: true })
    email!: string;

    @VString({ empty: false })
    password!: string;
}
