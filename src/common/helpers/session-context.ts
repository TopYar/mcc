import { IJwtPayload } from './jwt';

interface IContextData {
    [k: string]: any,
    /** Оригинальный url */
    url?: string,

    /** Токен, который был использован в запросе */
    jwt?: IJwtPayload,
}

export class SessionContext {
    traceId: string;
    data: IContextData;
    constructor(traceId: string, data: IContextData = {}) {
        this.traceId = traceId;
        this.data = data;
    }
}