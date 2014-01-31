var http = require('http');
var config = require('./config/config/config.json');
var express = require('express');

var app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server)
    .set('log level', 2)
    .set('close timeout', 35)
    .set('max reconnection attempts', 100)
    .set('heartbeat timeout', 60)
    .set('heartbeat interval', 25)
    .set('transports', [
        'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'
    ])
    .set('browser client minification', true)
    .set('browser client gzip', true);

var socket = require('./src/app/socket/socket.js');
socket.init(io);

app.set(config.env);

app.configure(function() {
    app.set('port', config.server.port);
});

app.configure('development', function() {
    app.use(express.logger('dev'));
});

app.configure('production', function() {});

// Routes
app.get('*', function(req, res) {
    res.send('Socket.IO');
});

io.sockets.on('connection', socket.run);

var response = require('http').ServerResponse.prototype;

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});