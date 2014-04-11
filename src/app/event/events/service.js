var self = module.exports = function (events, io)
{
    /**
     * Event сервер запросил список ID активных сокетов пользователей
     *
     * @publish service:online:users:list
     */
    events.subscribe('service:online:users', function (data) {
        console.log('Subscribe: service:online:users');
        var clients = io.sockets.clients();

        var chats_uids = [];
        // Перебираем всех сокеты
        clients.forEach(function(client) {
            // Отбираем только пользователей
            if (!client.agent) {
                // Заполняем массив UID актинвных чатов
                chats_uids.push(client.chat_uid)
            }
        });

        events.publish('service:online:users:list', { chats_uids: chats_uids } )
    });

    /**
     * Event сервер оповестил о необходимости обновить список пользователей
     *
     * @emit service:online:users:list
     */
    events.subscribe('service:update:users:list', function (data) {
        console.log('Subscribe: service:update:users:list');

        io.sockets.emit('service:update:users:list');
    });

    return self;
};