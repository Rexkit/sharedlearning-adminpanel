const bcrypt = require('bcrypt');
const db = require('./models');
const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();
const sessionStorage = {
    store: new RedisStore({
        client: redisClient
    }),
    secret: 'this is secret',
    resave: false,
};

async function authenticate(email, password) {
    const userRecord = await db.users.findOne({
        where: { email }
    });
    if (userRecord) {
        const matched = await bcrypt.compare(password, userRecord.password);
        if (matched && userRecord.admin) {
            return userRecord;
        }
    }
    return false;
}

module.exports = {
    authenticate,
    sessionStorage,
};