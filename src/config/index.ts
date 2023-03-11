import * as dotenv from 'dotenv';
dotenv.config();
export default {
    project: process.env.PROJECT_NAME,
    server: {
        port: process.env.PORT || 3000,
        salt: process.env.HASH_SALT,
        sessionKey: process.env.SESSION_KEY,
        sessionPrefix: process.env.PROJECT_NAME + ':' + process.env.SESSION_PREFIX + ':',
        confirmationPrefix: process.env.PROJECT_NAME + ':' + process.env.CONFIRMATION_PREFIX + ':',
        sessionExpire: process.env.SESSION_EXPIRE, // in days
        jwtSecret: process.env.JWT_SECRET,
        jwt: {
            jwtSecret: process.env.JWT_SECRET,
            accessExpiration: process.env.JWT_ACCESS_EXPIRATION, // minutes
        },
        aes: {
            iv: process.env.AES_IV,
            secret: process.env.AES_SECRET,
        },
    },
    email: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD,
        name: process.env.MAIL_NAME,
    },
    emailUrl: process.env.MAIL_URL,
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        pass: process.env.REDIS_PASS,
    },
    database: {
        dbHost: process.env.DB_HOST,
        dbPort: process.env.DB_PORT,
        dbName: process.env.DB_NAME,
        dbUser: process.env.DB_USER,
        dbPassword: process.env.DB_PASSWORD,
    },
};