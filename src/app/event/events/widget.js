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
        if (io.sockets.in(data.widget_uid).sockets[data.socket_id]) {
            io.sockets.in(data.widget_uid).sockets[data.socket_id].emit('widget:info:sended', data);
        } else {
            console.log('Socket ', data.socket_id, ' not exist')
        }
    });

    /**
     * Event сервер сохранил настройки стилей виджета
     * @param Object data = {
     *       array  settings   - массив настроек стилей
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit widget:setting:style:edited
     */
    events.subscribe('widget:setting:style:edited', function (data) {
        console.log('Subscribe: widget:setting:style:edited');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('widget:setting:style:edited', data);
    });

    /**
     * Event сервер сохранил триггер виджета
     * @param Object data = {
     *       Object trigger    - данные триггера
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit widget:setting:triggers:edited
     */
    events.subscribe('widget:setting:triggers:edited', function (data) {
        console.log('Subscribe: widget:setting:triggers:edited');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('widget:setting:triggers:edited', data);
    });

    /**
     * Event сервер удалил триггер виджета
     * @param Object data = {
     *       string trigger_uid - UID триггера
     *       string widget_uid  - UID виджета
     *   }
     *
     * @emit widget:setting:triggers:removed
     */
    events.subscribe('widget:setting:triggers:removed', function (data) {
        console.log('Subscribe: widget:setting:triggers:removed');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('widget:setting:triggers:removed', data);
    });

    return self;
};