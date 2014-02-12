var self = module.exports = {};

self.initialize = function (events)
{
    require('./events/user.js');
    require('./events/agent.js');
};