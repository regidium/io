var self = module.exports = function (io, socket, events)
{
    /**
     * Пользователь сменил страницу
     * 
     * @param Object data {
     *   Object person_uid - UID пользователя
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

    return self;
};