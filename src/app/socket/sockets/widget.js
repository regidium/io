var _ = require('underscore');

var self = module.exports = function (io, socket, events)
{
    /**
     * Запрашиваем инфьрмацию о виджете
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

    return self;
};