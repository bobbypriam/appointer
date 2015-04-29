var session = require('express-session');
var RedisStore = require('connect-redis')(session);

module.exports = session({
    store: new RedisStore({ host: 'localhost', port: 6379, db: 1 }),
    secret: 'verysecret',
    resave: false,
    saveUninitialized: false,
    unset: 'destroy'
});