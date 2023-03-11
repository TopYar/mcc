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



    ERROR_NEED_LOGIN: {
        code: 3000,
        msg: 'Login is required to use this method',
    },
    ERROR_JWT_TOKEN_IS_INVALID: {
        code: 3001,
        msg: 'Invalid jwt token',
    },
    ERROR_INVALID_CREDENTIALS: {
        code: 3002,
        msg: 'Provided credentials are invalid',
    },
    ERROR_SESSION_IS_INVALID: {
        code: 3003,
        msg: 'Session in jwt is not found',
    },
    ERROR_CONFIRMATION_CODE_IS_INVALID: {
        code: 3004,
        msg: 'Confirmation code is invalid',
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
