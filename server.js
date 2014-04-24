var http       = require('http');
var config     = require('./config/config/config.json');
var express    = require('express');
var morgan     = require('morgan');
var RedisStore = require('socket.io/lib/stores/redis');
var redis      = require('redis');

var pub    = redis.createClient();
var sub    = redis.createClient();
var client = redis.createClient();

var app    = express();
var server = http.createServer(app);

var io = require('socket.io').listen(server)
    /*.set('flash policy port', config.server.port)*/
    .set('log level', 2)
    .set('close timeout', 35)
    .set('max reconnection attempts', 100)
    .set('heartbeat timeout', 60)
    .set('heartbeat interval', 25)
    .set('transports', [
        'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'
    ])
    .set('browser client minification', true)
    .set('browser client gzip', true)
    .set('store', new RedisStore({
        redis: redis,
        redisPub: pub,
        redisSub: sub,
        redisClient: client
    }))
;

var env = config.env || 'development';
app.set(config.env);

app.set('port', config.server.port);

app.use(function(err, req, res, next) {
    if (!err) {
        return next();
    }

    res.json({error: err});
});

if ('development' == env) {
    app.use(morgan('dev'));
}

if ('production' == env) {}

// Events
var events = require('./src/framework/events/events');
events.initialize();
require('./src/app/event/events')(events, io);

// Socket
var sockets = require('./src/app/socket/sockets.js');
sockets.initialize(io, events);

// Routes

/**
 * On all requests add headers
 */
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});

app.get('*', function(req, res) {
    res.send('Socket.IO');
});

// Start Socket
io.sockets.on('connection', sockets.connection);

var response = require('http').ServerResponse.prototype;

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});