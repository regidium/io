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

    /**
     * Event сервер вернул список непрочитанных сообщений
     * @param Object data = {
     *       Object new_messages - список непрочитанных сообщений
     *       string widget_uid   - UID виджета
     *   }
     *
     * @emit widget:message:new:list
     */
    events.subscribe('widget:message:new:list', function (data) {
        console.log('Subscribe: widget:message:new:list');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('widget:message:new:list', data);
    });

    /**
     * Event сервер вернул транзакцию на оплату виджета
     * @param Object data = {
     *       Object payment    - данные оплаты
     *       string agent_uid  - UID агента
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit widget:payment:transaction
     */
    events.subscribe('widget:payment:transaction', function (data) {
        console.log('Subscribe: widget:payment:transaction');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('widget:payment:transaction', data);
    });

    /**
     * Event сервер вернул событие смены тарифного плана виджета
     * @param Object data = {
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit widget:plan:changed
     */
    events.subscribe('widget:plan:changed', function (data) {
        console.log('Subscribe: widget:plan:changed');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('widget:plan:changed', data);
    });

    return self;
};