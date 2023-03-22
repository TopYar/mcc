import { Email } from '../../../utils/validator';

export class RecoverDto {

    @Email({ normalize: true })
    email!: string;
}
