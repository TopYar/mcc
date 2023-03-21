import colors from '@colors/colors';
import path from 'path';
import winston from 'winston';

import config from '../config';
const { json, colorize, combine, timestamp, label, printf } = winston.format;

const rootPath = path.resolve(__dirname + '/../');

const loggerConfig = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
        custom: 7,
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'grey',
        info: 'green',
        verbose: 'cyan',
        silly: 'magenta',
        custom: 'yellow',
    },
};

const colorizedFormat = printf(({ level, message, label = config.project, timestamp, ...meta }) => {
    if (label) {
        label = colors.cyan('[' + label + ']');
    }

    return `${timestamp} ${level}\t${label}\t${message} ${colors.gray(JSON.stringify(meta))}`;
});

winston.addColors(loggerConfig.colors);

const mainLogger = winston.createLogger({
    levels: loggerConfig.levels,
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                colorizedFormat,
            ),
        }),
        new winston.transports.File({
            filename: `./logs/json/${config.project}${config.buildId ? '-' + config.buildId : ''}.log`,
            format: combine(
                timestamp(),
                json(),
            ),
            rotationFormat: function() {
                return getFormattedDate();
            },
            maxsize: 5 * 1024 * 1024,
        }),
        new winston.transports.File({
            filename: `./logs/colors/${config.project}${config.buildId ? '-' + config.buildId : ''}.log`,
            format: combine(
                colorize(),
                timestamp(),
                colorizedFormat,
            ),
            rotationFormat: function() {
                return getFormattedDate();
            },
            maxsize: 5 * 1024 * 1024,
        }),
    ],
});

export function createLogger(dir: string) {
    return mainLogger.child({
        label: dir
            .replace(rootPath + '/', '')
            .replace(/\.([tj])s/, '')
            .split('/').join(':'),
    });
}

function getFormattedDate() {
    const temp = new Date();

    return padStr(temp.getFullYear()) + '-' +
        padStr(1 + temp.getMonth()) + '-' +
        padStr(temp.getDate()) + '-' +
        padStr(temp.getHours()) + '-' +
        padStr(temp.getMinutes()) + '-' +
        padStr(temp.getSeconds());
}
function padStr(i: number) {
    return (i < 10) ? '0' + i : '' + i;
}