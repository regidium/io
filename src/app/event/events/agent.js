var self = module.exports = function (events, io)
{
    /**
     * Event сервер сообщил о входе агента
     * @param Object data = {
     *       Object person     - данные агента
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit agent:connected
     */
    events.subscribe('agent:connected', function (data) {
        console.log('Subscribe: agent:connected');

        // Оповещаем слушателей о входе агента
        io.sockets.in(data.widget_uid).emit('agent:connected', data);
    });

    /**
     * Event сервер сообщил о выходе агента
     * @param Object data = {
     *       string person_uid - UID агента
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit agent:disconnected
     */
    events.subscribe('agent:disconnected', function (data) {
        console.log('Subscribe: agent:disconnected');

        // Оповещаем слушателей о выходе агента
        io.sockets.in(data.widget_uid).emit('agent:disconnected', data);
    });

    return self;
};