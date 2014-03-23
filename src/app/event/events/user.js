var self = module.exports = function (events, io)
{
    return self;

    /**
     * Event сервер сообщил о создании чата
     * @param Object data = {
     *       string person     - данные персоны
     *       string socket_id  - ID сокета
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit user:auth:entered
     */
    events.subscribe('user:auth:entered', function (data) {
        console.log('user:auth:entered');

        // Оповещаем слушателей о создании чата
        io.sockets.in(data.widget_uid).sockets[data.socket_id].emit('user:auth:entered', data);
    });
};