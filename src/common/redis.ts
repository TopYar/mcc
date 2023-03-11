import RedisStore from 'connect-redis';
import { createClient } from 'redis';

import config from '../config';

export const redisClient = createClient({
    url: `redis://:${config.redis.pass}@${config.redis.host}:${config.redis.port}`,
});

redisClient.connect().catch(console.error);

export const ttl = 60 * 60 * 24 * Number(config.server.sessionExpire ?? 90);

export const store = new RedisStore({
    client: redisClient,
    prefix: config.server.sessionPrefix,
    ttl, // in days
});