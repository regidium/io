var self = module.exports = function (events, io)
{
    require('./events/user.js')(events, io);
    require('./events/agent.js')(events, io);
    require('./events/chat.js')(events, io);
    require('./events/widget.js')(events, io);
};