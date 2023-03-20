import colors from '@colors/colors';
import path from 'path';
import winston from 'winston';

import config from '../config';
const { colorize, combine, timestamp, label, printf } = winston.format;

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

const myFormat = printf(({ level, message, label = config.project, timestamp, ...meta }) => {
    if (label) {
        label = colors.cyan('[' + label + ']');
    }

    return `${timestamp} ${level}\t${label}\t${message} ${colors.gray(JSON.stringify(meta))}`;
});

winston.addColors(loggerConfig.colors);

const mainLogger = winston.createLogger({
    levels: loggerConfig.levels,
    level: 'info',
    format: combine(
        colorize(),
        timestamp(),
        myFormat,
    ),
    transports: [new winston.transports.Console()],
});

export function createLogger(dir: string) {
    return mainLogger.child({
        label: dir
            .replace(rootPath + '/', '')
            .replace(/\.([tj])s/, '')
            .split('/').join(':'),
    });
}