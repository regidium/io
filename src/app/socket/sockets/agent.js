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
     *
     * @emit agent:existed
     */
    socket.on('agent:existed', function(data) {
        console.log('Socket agent:existed');

        // Оповещаем event сервер
        events.publish('agent:existed', { widget_uid: data.widget_uid });
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
     *
     * @emit agent:disconnected
     */
    socket.on('agent:connect', function(data) {
        console.log('Socket agent:connect');

        socket.agent_uid = data.agent.uid;

        // Удаляем таймер отключения
        if (io.timers['agent_' + data.agent.uid]) {
            // ===== Агент вернулся
            clearTimeout(io.timers['agent_' + data.agent.uid]);

            // Подключаем сокет к комнате виджета
            socket.join(data.widget_uid);
        } else {
            // ===== Агент зашел
            socket.agent_uid = data.agent.uid;
            socket.widget_uid = data.widget_uid;
            // Подключаем пользователя к комнате виджета
            socket.join(data.widget_uid);

            // Оповещаем event сервер
            events.publish('agent:connect', { agent: data.agent, session: data.session, widget_uid: data.widget_uid });
        }
    });

    /**
     * Агент отключился
     * 
     * @param Object data {
     *   Object agent_uid  - UID агента
     *   string widget_uid - UID виджета
     * }
     *
     * @publish agent:disconnect
     *
     * @emit agent:disconnected
     */
    socket.on('agent:disconnect', function(data) {
        console.log('Socket agent:disconnect');

        // Оповещаем event сервер
        events.publish('agent:disconnect', { agent_uid: data.agent_uid, widget_uid: data.widget_uid });
        // Отключаем агена от комнаты виджета
        socket.leave(data.widget_uid);
        // Оповещаем слушателей
        socket.broadcast.to(data.widget_uid).emit('agent:disconnected', data);
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

    return self;
};