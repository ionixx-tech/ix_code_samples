import redis from 'redis';
import logger from './../../log/index';

const clientOptions = {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASS
};

export default class redisService {
    
     /**
     * Function to get redis server connection
     * @returns {redisClient}
     */
    getRedisConnection(callback) {
        let client =  redis.createClient(clientOptions);
        client.on('ready',() => {
            logger.info("Redis is ready");
            callback(null, client);
        });
        client.on('error', (err) => {
            logger.error("Redis connect error: ", err);
            callback(err, null);
        });
    }
}

