var self = module.exports = function (io, socket, events)
{
    /**
     * Агент подключился
     * 
     * @param Object data {
     *   Object  person - персона агента,
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('agent:connect', function(data) {
        console.log('Socket agent:connect');
        socket.person = data.person;
        socket.widget_uid = data.widget_uid;
        // Подключаем пользователя к комнате виджета
        socket.join(data.widget_uid);

        // Оповещаем event сервер
        events.publish('agent:connect', { person: data.person, widget_uid: data.widget_uid });
    });

    /**
     * Агент отключился
     * 
     * @param Object data {
     *   Object person_uid - UID агента
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('agent:disconnect', function(data) {
        console.log('Socket agent:disconnect');
        // Оповещаем event сервер
        self.pub.publish('agent:disconnected', { person: data.person_uid, widget: data.widget_uid });
        // Отключаем агена от комнаты виджета
        socket.leave(data.widget_uid);
        // Оповещаем слушателей
        socket.broadcast.to(data.widget_uid).emit('agent:disconnected', data);
    });

    return self;
};