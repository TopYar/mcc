import { applyDecorators, CanActivate, ExecutionContext, Injectable, SetMetadata, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import fs from 'fs';
import path from 'path';

import { HtmlTemplate } from '../helpers/html-templates';
import { ServiceException } from '../ServiceException';
import { ServiceResponse } from '../ServiceResponse';


export const HtmlPage = (page: HtmlTemplate) => {
    return applyDecorators(
        SetMetadata('page', page),
        UseGuards(HtmlPageGuard));
};


@Injectable()
class HtmlPageGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext) {
        const page = this.reflector.get<HtmlTemplate>('page', context.getHandler());
        const req = context.switchToHttp().getRequest();

        try {
            const html = fs.readFileSync(path.resolve(__dirname, `../../static/pages/${page}.html`), 'utf-8');

            req.ctx.data.html = html;
        } catch (e) {
            throw new ServiceException(ServiceResponse.CODES.ERROR_HTML_TEMPLATE_NOT_FOUND);
        }

        return true;
    }
}