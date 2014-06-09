var self = module.exports = function (io, socket, events)
{
    /**
     * Сокет отключился
     *
     * @publish chat:disconnect
     * @publish agent:disconnect
     */
    socket.on('disconnect', function () {
        console.log('Socket disconnect', socket.chat_uid, socket.agent_uid);

        // Если отключается пользователь
        if (socket.chat_uid) {
            io.timers['chat_'+socket.chat_uid] = setTimeout(function() {
                // Оповещаем агентов
                socket.broadcast.to(socket.widget_uid).emit('chat:disconnect', { chat_uid: socket.chat_uid, widget_uid: socket.widget_uid });
                // Оповещаем event сервер об отключении чата
                events.publish('chat:disconnect', { chat_uid: socket.chat_uid, widget_uid: socket.widget_uid });
                // Удаляем таймер
                delete io.timers['chat_' + socket.chat_uid];
            }, 6000);
        } else if (socket.agent_uid) {
            io.timers['agent_'+socket.agent_uid] = setTimeout(function() {
                // Оповещаем пользователей
                socket.broadcast.to(socket.widget_uid).emit('agent:disconnect', { agent_uid: socket.agent_uid, widget_uid: socket.widget_uid });
                // Отключаем агена от комнаты виджета
                socket.leave(socket.widget_uid);
                // Оповещаем event сервер об отключении агента
                events.publish('agent:disconnect', { agent_uid: socket.agent_uid, widget_uid: socket.widget_uid });
                // Удаляем таймер
                delete io.timers['chat_' + socket.agent_uid];
            }, 6000);
        }
    });

    socket.on('reconnecting', function () {
        console.log('Socket reconnecting');
    });

    socket.on('reconnect', function () {
        console.log('Socket reconnect');
    });

    return self;
};