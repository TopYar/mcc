import { Injectable } from '@nestjs/common';
import ejs from 'ejs';
import fs from 'fs';
import nodemailer from 'nodemailer';
import * as path from 'path';

import { ServiceResponse } from '../../common/ServiceResponse';
import config from '../../config';
import { SendDto } from './dto/send.dto';

const transport = nodemailer.createTransport({
    url: `smtps://${config.email.user}:${config.email.password}@${config.email.host}:${config.email.port}/`,
});

@Injectable()
export class EmailService {

    private _send(email: string, subject: string, body: string) {
        transport.sendMail({
            from: `${config.email.name} <${config.email.user}>`,
            to: email,
            subject,
            html: body,
        }).catch(e => {
            console.error(e);
        });
    }
    async send({ email, template, subject, params }: SendDto) {
        const html = fs.readFileSync(path.resolve(__dirname, `../../static/templates/${template}.html`), 'utf-8');
        const rendered = ejs.render(html, params);

        this._send(email, subject, rendered);

        return ServiceResponse.ok(null);
    }

}
