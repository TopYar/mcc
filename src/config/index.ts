import * as dotenv from 'dotenv';
dotenv.config();
export default {
    project: process.env.MCC_PROJECT_NAME,
    buildId: process.env.BUILD_ID,
    baseUrl: process.env.MCC_BASE_URL,
    server: {
        port: process.env.MCC_PORT || 3000,
        salt: process.env.MCC_HASH_SALT,
        sessionKey: process.env.MCC_SESSION_KEY,
        sessionPrefix: process.env.MCC_PROJECT_NAME + ':' + process.env.MCC_SESSION_PREFIX + ':',
        confirmationPrefix: process.env.MCC_PROJECT_NAME + ':' + process.env.MCC_CONFIRMATION_PREFIX + ':',
        recoverLinkPrefix: process.env.MCC_PROJECT_NAME + ':' + process.env.MCC_RECOVER_LINK_PREFIX + ':',
        sessionExpire: process.env.MCC_SESSION_EXPIRE, // in days
        jwtSecret: process.env.MCC_JWT_SECRET,
        jwt: {
            jwtSecret: process.env.MCC_JWT_SECRET,
            accessExpiration: process.env.MCC_JWT_ACCESS_EXPIRATION, // hours
        },
        aes: {
            iv: process.env.MCC_AES_IV,
            secret: process.env.MCC_AES_SECRET,
        },
    },
    email: {
        host: process.env.MCC_MAIL_HOST,
        port: process.env.MCC_MAIL_PORT,
        user: process.env.MCC_MAIL_USER,
        password: process.env.MCC_MAIL_PASSWORD,
        name: process.env.MCC_MAIL_NAME,
    },
    emailUrl: process.env.MCC_MAIL_URL,
    redis: {
        host: process.env.MCC_REDIS_HOST,
        port: process.env.MCC_REDIS_PORT,
        pass: process.env.MCC_REDIS_PASS,
    },
    database: {
        dbHost: process.env.MCC_DB_HOST,
        dbPort: process.env.MCC_DB_PORT,
        dbName: process.env.MCC_DB_NAME,
        dbUser: process.env.MCC_DB_USER,
        dbPassword: process.env.MCC_DB_PASSWORD,
    },
};