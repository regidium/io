var self = module.exports = function (io, socket, events)
{
    /**
     * Агент подключился
     * 
     * @param Object data {
     *   Object agent      - данные агент,
     *   string widget_uid - UID виджета
     * }
     *
     * @publish agent:connect
     *
     * @emit agent:disconnected
     */
    socket.on('agent:connect', function(data) {
        console.log('Socket agent:connect');

        socket.agent = data.agent;
        socket.widget_uid = data.widget_uid;
        // Подключаем пользователя к комнате виджета
        socket.join(data.widget_uid);

        // Оповещаем event сервер
        events.publish('agent:connect', { agent: data.agent, widget_uid: data.widget_uid });
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
        events.publish('agent:disconnect', { agent: data.agent_uid, widget: data.widget_uid });
        // Отключаем агена от комнаты виджета
        socket.leave(data.widget_uid);
        // Оповещаем слушателей
        socket.broadcast.to(data.widget_uid).emit('agent:disconnected', data);
    });

    return self;
};