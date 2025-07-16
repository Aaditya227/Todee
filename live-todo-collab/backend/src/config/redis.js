const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-14400.c99.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 14400
    }
});


module.exports = redisClient;