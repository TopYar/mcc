/** Результат вызова любого метода */

export interface IError {
    /** Код ошибки */
    code: number,
    msg: string,
}

export interface IOkResult<RESULT> {
    /** Успех  */
    success: true;
    /** Результат, будет только в случае успешного ответа */
    result: RESULT;
}
export interface IFailResult {
    /** Успех  */
    success: false;
    result: null;
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
        msg: 'DB error',
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
    VALIDATION_ERROR: {
        code: 2001,
        msg: 'Validation error',
    },
    ERROR_EMAIL_INVALID: {
        code: 2002,
        msg: 'Email is invalid',
    },
    ERROR_PASSWORD_INVALID: {
        code: 2003,
        msg: 'Password is invalid',
    },
    ERROR_REFRESH_JWT_TOKEN_REQUIRED: {
        code: 2004,
        msg: 'You need to provide refresh jwt only',
    },
    ERROR_ACCESS_JWT_TOKEN_REQUIRED: {
        code: 2005,
        msg: 'You need to provide access jwt only',
    },
    ERROR_CONFIRMATION_JWT_TOKEN_REQUIRED: {
        code: 2006,
        msg: 'You need to provide confirmation jwt only',
    },
    ERROR_JWT_TOKEN_IS_EXPIRED: {
        code: 2008,
        msg: 'Jwt token is expired',
    },
    ERROR_INCORRECT_CREDENTIALS: {
        code: 2009,
        msg: 'Provided credentials are incorrect',
    },
    ERROR_SESSION_IS_INVALID: {
        code: 2010,
        msg: 'Session in jwt is not found',
    },
    ERROR_CONFIRMATION_CODE_IS_INVALID: {
        code: 2011,
        msg: 'Confirmation code is invalid',
    },

    ERROR_JWT_TOKEN_IS_INVALID: {
        code: 3000,
        msg: 'Invalid jwt token',
    },
    FAIL_USER_NOT_FOUND: {
        code: 3001,
        msg: 'User not found',
    },
    ERROR_USER_ALREADY_EXISTS: {
        code: 3002,
        msg: 'User already exists',
    },
    ERROR_EMAIL_IS_NOT_CONFIRMED: {
        code: 3003,
        msg: 'Email is not confirmed',
    },
    ERROR_RECOVER_LINK_IS_EXPIRED: {
        code: 3004,
        msg: 'Recover link is expired',
    },
    ERROR_NEED_LOGIN: {
        code: 3005,
        msg: 'Login is required to use this method',
    },
    FAIL_CONDITION_NOT_FOUND: {
        code: 3006,
        msg: 'Condition not found',
    },

    FAIL_SERVICE_REQUEST: {
        code: 4000,
        msg: 'Request to the service was failed',
    },
    FAIL_SEND_MAIL: {
        code: 4001,
        msg: 'Fail send mail',
    },
    FAIL_CONFIRM_USER: {
        code: 4002,
        msg: 'Fail to confirm user email',
    },
    FAIL_CREATE_RECOVER_LINK: {
        code: 4003,
        msg: 'Fail to create recover link',
    },
    FAIL_USE_RECOVER_LINK: {
        code: 4004,
        msg: 'Fail to process recover link',
    },
    FAIL_GET_RECOVER_LINK: {
        code: 4005,
        msg: 'Fail to process recover link',
    },
    ERROR_HTML_TEMPLATE_NOT_FOUND: {
        code: 4006,
        msg: 'Page not found',
    },
    FAIL_REGISTER_USER: {
        code: 4007,
        msg: 'Fail to register user',
    },
    FAIL_RESEND_CODE: {
        code: 4008,
        msg: 'Fail to resend code',
    },
    FAIL_GET_CONDITION: {
        code: 4009,
        msg: 'Fail get condition',
    },
    FAIL_GET_MEASUREMENTS: {
        code: 4010,
        msg: 'Fail get measurements',
    },
    FAIL_GET_CONDITION_PRESETS: {
        code: 4011,
        msg: 'Fail get condition presets',
    },
    FAIL_GET_MEASUREMENTS_PRESETS: {
        code: 4012,
        msg: 'Fail get condition presets',
    },

    ERROR_UNEXPECTED: {
        code: 9999,
        msg: 'Unexpected error',
    },
};

export const ServiceResponse = {
    CODES: CODES,
    ok<T>(result: T): IOkResult<T> {
        return {
            success: true,
            result: result,
        };
    },
    fail(code: { code: number; msg: string; }, result?: any): IFailResult {
        return {
            success: false,
            result: result ?? undefined,
            error: code,
        };
    },
};
