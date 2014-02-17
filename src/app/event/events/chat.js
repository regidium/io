var self = module.exports = function (events, io)
{
    /**
     * Event сервер сообщил о создании чата
     * @param Object data = {
     *       string chat       - данные чата
     *       string person     - данные пользователя
     *       string widget_uid - UID виджета
     *       string socket_id  - ID сокета
     *   }
     *
     * @emit chat:created
     */
    events.subscribe('chat:created', function (data) {
        console.log('Subscribe: chat:created');

        // Оповещаем слушателей о создании чата
        io.sockets.in(data.widget_uid).sockets[data.socket_id].emit('chat:created', data);
    });

    /**
     * Event сервер сообщил о подключении чата
     * @param Object data = {
     *       Object person     - данные пользователя
     *       Object chat       - данные чата
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:connected
     */
    events.subscribe('chat:connected', function (data) {
        console.log('Subscribe: chat:connected');

        // Оповещаем слушателей о подключении чата
        io.sockets.in(data.widget_uid).emit('chat:connected', data);
    });

    /**
     * Event сервер сообщил об отключении чата
     * @param Object data = {
     *       string chat_uid   - UID чата
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:disconnected
     */
    events.subscribe('chat:disconnected', function (data) {
        console.log('Subscribe: chat:disconnected');

        // Оповещаем слушателей об отключении чата
        io.sockets.in(data.widget_uid).emit('chat:disconnected', data);
    });

    /**
     * Event сервер сообщил об подключении агента к чату
     * @param Object data = {
     *       Object chat       - данные чата
     *       Object person     - данные агента
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:agent:entered
     */
    events.subscribe('chat:agent:entered', function (data) {
        console.log('Subscribe: chat:agent:entered');

        // Оповещаем слушателей о подключении агента к чату
        io.sockets.in(data.widget_uid).emit('chat:agent:entered', data);
    });

    return self;
};