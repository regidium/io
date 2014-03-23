var self = module.exports = function (io, socket, events)
{
    /**
     * Пользователь сменил страницу
     * @TODO
     * 
     * @param Object data {
     *   string person_uid - UID пользователя
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('user:page:change', function(data) {
        console.log('Socket user:page:change');
        // Оповещаем event сервер
        self.pub.publish('user:page:changed', { person_uid: data.person_uid, widget_uid: data.widget_uid });
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('chat:destroy', data);
    });

    /**
     * Пользователь авторизировался
     * 
     * @param Object data {
     *    Object person     - Объект пользователя
     *   string chat_uid   - UID пользователя
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('user:auth:enter', function(data) {
        console.log('Socket user:auth:enter');

        // Оповещаем event сервер
        self.pub.publish('user:auth:enter', { person: data.person, socket_id: socket.id, widget_uid: data.widget_uid });
    });

    return self;
};