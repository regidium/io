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

    /**
     * Запрос списока непрочитанных сообщений
     *
     * @param Object data {
     *   string widget_uid  - UID виджета
     * }
     * 
     * @publish widget:message:new:get
     */
    socket.on('widget:message:new:get', function(data) {
        console.log('Socket widget:message:new:get');

        // Запрашиваем event сервер
        events.publish('widget:message:new:get', data);
    });

    /**
     * Запрос списока непрочитанных сообщений
     *
     * @param Object data {
     *   string widget_uid  - UID виджета
     * }
     * 
     * @publish widget:message:new:get
     */
    socket.on('widget:message:new:get', function(data) {
        console.log('Socket widget:message:new:get');

        // Запрашиваем event сервер
        events.publish('widget:message:new:get', data);
    });

    /**
     * Оплата услуг виджета
     *
     * @param Object data {
     *   Object pay        - метод оплаты
     *   string widget_uid - UID виджета
     * }
     * 
     * @publish widget:payment:made
     */
    socket.on('widget:payment:made', function(data) {
        console.log('Socket widget:payment:made');

        // Запрашиваем event сервер
        events.publish('widget:payment:made', data);
    });

    /**
     * Смена тарифного плана
     *
     * @param Object data {
     *   int    plan       - тарифный план
     *   string widget_uid - UID виджета
     * }
     * 
     * @publish widget:plan:change
     */
    socket.on('widget:plan:change', function(data) {
        console.log('Socket widget:plan:change');

        // Запрашиваем event сервер
        events.publish('widget:plan:change', data);
    });

    return self;
};