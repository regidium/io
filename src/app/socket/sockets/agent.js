var self = module.exports = function (io, socket, events)
{
    /**
     * Получение списка агентов
     * 
     * @param Object data {
     *   string widget_uid - UID виджета
     * }
     *
     * @publish agent:existed
     */
    socket.on('agent:existed', function(data) {
        console.log('Socket agent:existed');

        // Оповещаем event сервер
        events.publish('agent:existed', { widget_uid: data.widget_uid });
    });

    /**
     * Получение списка онлайн агентов
     *
     * @param Object data {
     *   string widget_uid - UID виджета
     * }
     *
     * @emit agent:online:list
     */
    socket.on('agent:online', function(data) {
        console.log('Socket agent:online');

        var clients = io.sockets.clients();

        var agents_uids = [];
        // Перебираем все сокеты
        clients.forEach(function(client) {
            // Отбираем только агентов
            if (client.agent_uid && client.widget_uid && client.widget_uid == data.widget_uid) {
                // Заполняем массив UID актинвных агентов
                agents_uids.push(client.agent_uid)
            }
        });

        if (io.sockets.in(data.widget_uid).sockets[socket.id]) {
            io.sockets.in(data.widget_uid).sockets[socket.id].emit('agent:online:list', {agents_uids: agents_uids});
        }
    });

    /**
     * Агент подключился
     * 
     * @param Object data {
     *   Object agent      - данные агент,
     *   Object session    - данные сессии,
     *   string widget_uid - UID виджета
     * }
     *
     * @publish agent:connect
     */
    socket.on('agent:connect', function(data) {
        console.log('Socket agent:connect');

        socket.agent_uid = data.agent.uid;
        socket.widget_uid = data.widget_uid;

        // Удаляем таймер отключения
        if (io.timers['agent_' + data.agent.uid]) {
            // ===== Агент вернулся

            clearTimeout(io.timers['agent_' + data.agent.uid]);

            delete io.timers['agent_' + data.agent.uid];
        } else {
            // ===== Агент зашел

            // Оповещаем event сервер
            events.publish('agent:connect', { agent: data.agent, session: data.session, widget_uid: data.widget_uid });
        }

        // Подключаем сокет к комнате виджета
        socket.join(data.widget_uid);
    });

    /**
     * Сохранение агента
     * 
     * @param Object data {
     *   Object agent      - данные агента
     *   string widget_uid - UID виджета
     * }
     *
     * @publish agent:save
     *
     * @emit agent:save
     */
    socket.on('agent:save', function(data) {
        console.log('Socket agent:save');

        // Оповещаем event сервер
        events.publish('agent:save', { agent: data.agent, widget_uid: data.widget_uid });
    });

    /**
     * Удаление агента
     * 
     * @param Object data {
     *   Object agent_uid  - UID агента
     *   string widget_uid - UID виджета
     * }
     *
     * @publish agent:remove
     *
     * @emit agent:remove
     */
    socket.on('agent:remove', function(data) {
        console.log('Socket agent:remove');

        // Оповещаем event сервер
        events.publish('agent:remove', { agent_uid: data.agent_uid, widget_uid: data.widget_uid });
    });

    /**
     * Агент написал предложение
     *
     * @param Object data {
     *   Object issue  - предложение
     *   string agent_uid - UID агента
     * }
     *
     * @publish agent:issue:send
     */
    socket.on('agent:issue:send', function(data) {
        console.log('Socket agent:issue:send');

        // Оповещаем event сервер
        events.publish('agent:issue:send', data);
    });

    return self;
};