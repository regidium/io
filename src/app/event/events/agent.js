var self = module.exports = function (events, io)
{
    /**
     * Event сервер вернул список агентов
     * @param Object data = {
     *       array agents     - массив агентов
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit agent:existed:list
     */
    events.subscribe('agent:existed:list', function (data) {
        console.log('Subscribe: agent:existed:list');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('agent:existed:list', data);
    });

    /**
     * Event сервер сообщил о сохранении агента
     * @param Object data = {
     *       Object agent      - данные агента
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit agent:saved
     */
    events.subscribe('agent:saved', function (data) {
        console.log('Subscribe: agent:saved');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('agent:saved', data);
    });

    /**
     * Event сервер сообщил об удалении агента
     * @param Object data = {
     *       string agent_uid  - UID агента
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit agent:removed
     */
    events.subscribe('agent:removed', function (data) {
        console.log('Subscribe: agent:removed');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('agent:removed', data);
    });

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