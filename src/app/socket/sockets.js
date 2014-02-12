var self = module.exports = {};

self.initialize = function (io, events) {
    // SocketIO
    self.io = io;
    // Redis
    self.events = events;
}

self.connection = function (socket) {

    require('./sockets/user.js')(self.io, self.events);
    require('./sockets/agent.js')(self.io, self.events);

};