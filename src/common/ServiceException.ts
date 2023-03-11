import { IError } from './ServiceResponse';

export class ServiceException extends Error {
    code: IError;

    constructor(code: IError) {
        super();  // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype);  // restore prototype chain
        this.name = 'ServiceException';
        this.code = code;
    }
}