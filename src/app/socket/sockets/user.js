var self = module.exports = function (io, events)
{
    /**
     * Пользователь подключился
     * 
     * @param Object data {
     *   Object person     - персона пользователя,
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('user:connect', function(data) {
        console.log('Socket user:connect');
        socket.user = data.person;
        socket.widget_uid = data.widget_uid;

        // Создаем запись о пользователе виджета
        self.events.store.hmset('users:' + data.widget_uid + ':' + data.person.uid, { person: data.person }, function(e, r) {
            // Оповещаем event сервер
            self.events.publish('user:connected', { person_uid: data.person.uid, widget_uid: data.widget_uid });
            // Подключаем пользователя к комнате виджета
            socket.join(data.widget_uid);
            // Оповещаем агентов
            socket.broadcast.to(data.widget_uid).emit('user:connected', data);
        });
    });

    /**
     * Пользователь отключился
     * 
     * @param Object data {
     *   Object person     - персона пользователя,
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('user:disconnect', function(data) {
        console.log('Socket user:disconnect');
        // Оповещаем event сервер
        self.pub.publish('user:disconnected', { person: data.person.uid, widget: data.widget_uid });
        // Отключаем пользователя от комнаты виджета
        socket.leave(data.widget_uid);
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('user:disconnected', data);
    });

    /**
     * Пользователь сменил страницу
     * 
     * @param Object data {
     *   Object person     - персона пользователя,
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('user:page:change', function(data) {
        console.log('Socket user:page:change');
        // Оповещаем event сервер
        self.pub.publish('user:page:changed', { person: data.person.uid, widget: data.widget_uid });
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('user:page:changed', data);
    });

    /**
     * Пользователь открыл чат
     * 
     * @param Object data {
     *   Object person     - персона пользователя,
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('user:chat:open', function(data) {
        console.log('Socket user:chat:open');
        // Оповещаем event сервер
        self.pub.publish('user:chat:opened', { person: data.person.uid, widget: data.widget_uid });
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('user:chat:opened', data);
    });

    /**
     * Пользователь закрыл чат
     * 
     * @param Object data {
     *   Object person     - персона пользователя,
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('user:chat:close', function(data) {
        console.log('Socket user:chat:close');
        // Оповещаем event сервер
        self.pub.publish('user:chat:closed', { person: data.person.uid, widget: data.widget_uid });
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('user:chat:closed', data);
    });

    /**
     * Пользователь отправил сообщение
     * 
     * @param Object data {
     *   Object person     - персона пользователя,
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('user:chat:message:send', function(data) {
        console.log('Socket user:chat:message:send');
        // Оповещаем event сервер
        self.pub.publish('user:chat:message:sended', { person: data.person.uid, widget: data.widget_uid });
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('user:chat:message:sended', data);
    });

    /**
     * Пользователь прочел сообщение
     * 
     * @param Object data {
     *   Object person     - персона пользователя,
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('user:chat:message:read', function(data) {
        console.log('Socket user:chat:message:read');
        // Оповещаем event сервер
        self.pub.publish('user:chat:message:readed', { person: data.person.uid, widget: data.widget_uid });
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('user:chat:message:readed', data);
    });

    /**
     * Пользователь удалил сообщение
     * 
     * @param Object data {
     *   Object person     - персона пользователя,
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('user:chat:message:remove', function(data) {
        console.log('Socket user:chat:message:remove');
        // Оповещаем event сервер
        self.pub.publish('user:chat:message:removed', { person: data.person.uid, widget: data.widget_uid });
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('user:chat:message:removed', data);
    });

    return self;
};