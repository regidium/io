var self = module.exports = {};

self.initialize = function (io, events) {
    // SocketIO
    self.io = io;
    // Redis
    self.events = events;

    io.timers = {};

    return self;
}

self.connection = function (socket) {
    require('./sockets/agent.js')(self.io, socket, self.events);
    require('./sockets/chat.js')(self.io, socket, self.events);
    require('./sockets/widget.js')(self.io, socket, self.events);
    require('./sockets/service.js')(self.io, socket, self.events);
};