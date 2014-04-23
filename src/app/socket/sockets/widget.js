var _ = require('underscore');

var self = module.exports = function (io, socket, events)
{
    /**
     * Запрашиваем информацию о виджете
     * 
     * @param Object data {
     *   string widget_uid - UID виджета
     * }
     *
     * @publish widget:info:get
     */
    socket.on('widget:info:get', function(data) {
        console.log('Socket widget:info:get');

        // Добавляем переменную widget_uid к сокету
        socket.widget_uid = data.widget_uid;
        // Подключаем сокет к комнате виджета
        socket.join(data.widget_uid);
        // Оповещаем event сервер о необходимости создать пользователя и чат
        events.publish('widget:info:get', { widget_uid: data.widget_uid, socket_id: socket.id });
    });

    /**
     * Сохраняем настройки стиля виджета
     * 
     * @param Object data {
     *   Object settings   - данные настроек
     *   string widget_uid - UID виджета
     * }
     *
     * @publish widget:setting:style:edit
     */
    socket.on('widget:setting:style:edit', function(data) {
        console.log('Socket widget:setting:style:edit');

        // Оповещаем event сервер
        events.publish('widget:setting:style:edit', data);
    });

    /**
     * Сохраняем триггер виджета
     * 
     * @param Object data {
     *   Object trigger     - данные триггера
     *   string trigger_uid - UID триггера
     *   string widget_uid  - UID виджета
     * }
     *
     * @publish widget:setting:triggers:edit
     */
    socket.on('widget:setting:triggers:edit', function(data) {
        console.log('Socket widget:setting:triggers:edit');

        // Оповещаем event сервер
        events.publish('widget:setting:triggers:edit', data);
    });

    /**
     * Удаляем триггер виджета
     * 
     * @param Object data {
     *   string trigger_uid - UID триггера
     *   string widget_uid  - UID виджета
     * }
     *
     * @publish widget:setting:triggers:remove
     */
    socket.on('widget:setting:triggers:remove', function(data) {
        console.log('Socket widget:setting:triggers:remove');

        // Оповещаем event сервер
        events.publish('widget:setting:triggers:remove', data);
    });

    return self;
};