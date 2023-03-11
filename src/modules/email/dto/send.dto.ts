import { EmailTemplate } from '../../../common/helpers/email-templates';

export interface SendDto {
    email: string;
    template: EmailTemplate,
    subject: string,
    params?: { [k: string]: any; };
}
