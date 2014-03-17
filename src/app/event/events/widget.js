var self = module.exports = function (events, io)
{
    /**
     * Event сервер вернул информацию о виджете
     * @param Object data = {
     *       string socket_id  - ID сокета
     *       string widget_uid - UID виджета
     *       array  settings   - массив настроек
     *       array  triggers   - массив триггеров
     *   }
     *
     * @emit chat:created
     */
    events.subscribe('widget:info:sended', function (data) {
        console.log('Subscribe: widget:info:sended');

        // Оповещаем слушателей о создании чата
        io.sockets.in(data.widget_uid).sockets[data.socket_id].emit('widget:info:sended', data);
    });

    return self;
};