export enum EJwtType {
    ACCESS = 'ACCESS',
    REFRESH = 'REFRESH',
    CONFIRMATION = 'CONFIRMATION',
}

export interface IJwtPayload {
    userId: string,
    sessionId: string,
    type: EJwtType,
}