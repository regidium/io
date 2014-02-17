var self = module.exports = {};

self.initialize = function (io, events) {
    // SocketIO
    self.io = io;
    // Redis
    self.events = events;

    return self;
}

self.connection = function (socket) {

    require('./sockets/user.js')(self.io, socket, self.events);
    require('./sockets/agent.js')(self.io, socket, self.events);
    require('./sockets/chat.js')(self.io, socket, self.events);

};