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

        var socket_ids = [];
        // Перебираем всех сокеты
        clients.forEach(function(client) {
            // Отбираем пользователей
            if (!client.agent) {
                // Заполняем массив ID сокетов
                socket_ids.push(client.id)
            }
        });

        events.publish('service:online:users:list', { socket_ids: socket_ids } )
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