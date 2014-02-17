var _ = require('underscore');
var redis = require('redis');
var config = require('../../../config/config/config');

var self = module.exports = {};

self.subscribtions = {};

self.initialize = function ()
{
    // Redis
    self.store = redis.createClient()
    self.pub = redis.createClient()
    self.sub = redis.createClient()

    self.sub.subscribe(config.redis.events_in);
    self.sub.on('message', function (chanell, event) {
        event = JSON.parse(event);
        self.handle_event(event.key, event.data);
    });

    console.log('Subscribed chanell regidium_events_io');
};

self.subscribe = function (key, cb)
{
    if (typeof(key) == 'string') {
        key = [key];
    }

    _.each(key, function (key_item) {
        if (!self.subscribtions[key_item]) {
            self.subscribtions[key_item] = [];
        }

        self.subscribtions[key_item].push(cb);
    });
};

self.handle_event = function (key, data)
{
    if (self.subscribtions[key] && self.subscribtions[key].length) {
        _.each(self.subscribtions[key], function (cb) {
            cb(data);
        });
    }
};

/**
 * @param string key
 * @param Object data
 */
self.publish = function (key, data)
{
    var event = JSON.stringify({ key: key, data: data});
    self.pub.publish(config.redis.events_out, event);
};