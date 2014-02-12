var self = module.exports = function (io, events)
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
        socket.agent = data.person;
        socket.widget_uid = data.widget_uid;

        // Создаем запись о пользователе виджета
        self.events.store.hmset('users:' + data.widget_uid + ':' + data.person.uid, { person: data.person }, function(e, r) {
            // Оповещаем event сервер
            self.events.publish('user:connected', { person_uid: data.person.uid, widget_uid: data.widget_uid });
            // Подключаем пользователя к комнате виджета
            socket.join(data.widget_uid);
            // Оповещаем агентов
            socket.broadcast.to(data.widget_uid).emit('agent:disconnected', data);
        });
    });

    /**
     * Агент отключился
     * 
     * @param Object data {
     *   Object  person - персона агента,
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('agent:disconnect', function(data) {
        console.log('Socket agent:disconnect');
        // Оповещаем event сервер
        self.pub.publish('agent:disconnected', { person: data.person.uid, widget: data.widget_uid });
        // Отключаем агена от комнаты виджета
        socket.leave(data.widget_uid);
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('agent:disconnected', data);
    });

    /**
     * Агент подключися к чату
     * 
     * @param Object data {
     *   Object  person - персона агента,
     *   string chat   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('agent:chat:enter', function(data) {
        console.log('Socket agent:chat:enter');
    });

    /**
     * Агент отключился от чата
     * 
     * @param Object data {
     *   Object  person - персона агента,
     *   string chat   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('agent:chat:leave', function(data) {
        console.log('Socket agent:chat:leave');
    });

    /**
     * Агент отправил сообщение
     * 
     * @param Object data {
     *   Object  person - персона агента,
     *   string chat   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('agent:chat:message:send', function(data) {
        console.log('Socket agent:chat:message:send');
    });

    /**
     * Агент прочел сообщение
     * 
     * @param Object data {
     *   Object  person     - персона агента,
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('agent:chat:message:read', function(data) {
        console.log('Socket agent:chat:message:read');
    });

    /**
     * Агент удалил сообщение
     * 
     * @param Object data {
     *   Object  person     - персона агента,
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('agent:chat:message:remove', function(data) {
        console.log('Socket agent:chat:message:remove');
    });

    return self;
};