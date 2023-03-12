/** Результат вызова любого метода */

export interface IError {
    /** Код ошибки */
    code: number,
    msg: string,
}

export interface IOkResult<RESULT = any | null> {
    /** Успех  */
    success: true;
    /** Результат, будет только в случае успешного ответа */
    result: RESULT;
}
export interface IFailResult<RESULT = any | null> {
    /** Успех  */
    success: false;
    /** Результат, будет только в случае успешного ответа */
    result: RESULT;
    error: IError;
}

export type TResult<RESULT> = IOkResult<RESULT> | IFailResult;

const CODES = {
    SUCCESS: {
        code: 0,
        msg: 'Успех',
    },


    INTERNAL_SERVER_ERROR: {
        code: -1,
        msg: 'Internal server error',
    },

    ERROR_DB_QUERY: {
        code: 1000,
        msg: 'Общая группа ошибок запросов к бд',
    },
    FAIL_GET_USER: {
        code: 1001,
        msg: 'Fail to get user',
    },
    FAIL_CREATE_USER: {
        code: 1002,
        msg: 'Fail to create user',
    },
    FAIL_UPDATE_USER: {
        code: 1003,
        msg: 'Fail to update user',
    },

    ERROR_BAD_REQUEST: {
        code: 2000,
        msg: 'Общая группа ошибок запросов к сервису',
    },
    FAIL_REGISTER_USER: {
        code: 2001,
        msg: 'Fail to register user',
    },
    FAIL_VALIDATION_ERROR: {
        code: 2002,
        msg: 'Ошибка валидации параметров',
    },
    FAIL_USER_NOT_FOUND: {
        code: 2003,
        msg: 'User not found',
    },
    ERROR_REFRESH_JWT_TOKEN_REQUIRED: {
        code: 2004,
        msg: 'You need to provide refresh jwt only',
    },
    ERROR_ACCESS_JWT_TOKEN_REQUIRED: {
        code: 2005,
        msg: 'You need to provide access jwt only',
    },
    FAIL_SEND_MAIL: {
        code: 2006,
        msg: 'Fail send mail',
    },
    FAIL_CONFIRM_USER: {
        code: 2007,
        msg: 'Fail to confirm user email',
    },
    FAIL_CREATE_RECOVER_LINK: {
        code: 2008,
        msg: 'Fail to create recover link',
    },
    FAIL_USE_RECOVER_LINK: {
        code: 2009,
        msg: 'Fail to process recover link',
    },
    FAIL_GET_RECOVER_LINK: {
        code: 2010,
        msg: 'Fail to process recover link',
    },
    ERROR_HTML_TEMPLATE_NOT_FOUND: {
        code: 2011,
        msg: 'Page not found',
    },



    ERROR_NEED_LOGIN: {
        code: 3000,
        msg: 'Login is required to use this method',
    },
    ERROR_JWT_TOKEN_IS_INVALID: {
        code: 3001,
        msg: 'Invalid jwt token',
    },
    ERROR_JWT_TOKEN_IS_EXPIRED: {
        code: 3002,
        msg: 'Jwt token is expired',
    },
    ERROR_INVALID_CREDENTIALS: {
        code: 3003,
        msg: 'Provided credentials are invalid',
    },
    ERROR_EMAIL_IS_NOT_CONFIRMED: {
        code: 3004,
        msg: 'Email is not confirmed',
    },
    ERROR_SESSION_IS_INVALID: {
        code: 3005,
        msg: 'Session in jwt is not found',
    },
    ERROR_CONFIRMATION_CODE_IS_INVALID: {
        code: 3006,
        msg: 'Confirmation code is invalid',
    },
    ERROR_RECOVER_LINK_IS_EXPIRED: {
        code: 3007,
        msg: 'Recover link is expired',
    },
    ERROR_USER_ALREADY_EXISTS: {
        code: 3100,
        msg: 'User already exists',
    },

    ERROR_UNEXPECTED: {
        code: 9999,
        msg: 'Непредвиденная ошибка',
    },
};

export const ServiceResponse = {
    CODES: CODES,
    ok(result: any = null): IOkResult {
        return {
            success: true,
            result: result,
        };
    },
    fail<T>(code: { code: number; msg: string; }, result?: T): IFailResult {
        return {
            success: false,
            result: result ?? undefined,
            error: code,
        };
    },
};
