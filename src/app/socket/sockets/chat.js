var _ = require('underscore');

var self = module.exports = function (io, socket, events)
{
    /**
     * Чат создается
     * 
     * @param Object data {
     *   Object use_data   - информация о пользователе
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:create
     */
    socket.on('chat:create', function(data) {
        console.log('Socket chat:create');

        // Добавляем переменную widget_uid к сокету
        socket.widget_uid = data.widget_uid;
        // Подключаем сокету к комнате виджета
        socket.join(data.widget_uid);
        // Оповещаем event сервер о необходимости создать пользователя и чат
        events.publish('chat:create', { widget_uid: data.widget_uid, user_data: data.user_data, socket_id: socket.id });
    });

    /**
     * Чат подключается
     *
     * @param Object data {
     *   Object person     - информация о пользователе
     *   Object chat       - информация о чате
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:connect
     */
    socket.on('chat:connect', function(data) {
        console.log('Socket chat:connect');

        // Добавляем переменную widget_uid к сокету
        socket.widget_uid = data.widget_uid;
        // Добавляем переменную chat_uid к сокету
        socket.chat_uid = data.chat.uid;
        // Подключаем чат к комнате виджета
        socket.join(data.widget_uid);
        // Оповещаем event сервер о подключении чата
        events.publish('chat:connect', { chat: data.chat, person: data.person, widget_uid: data.widget_uid });
    });

    /**
     * Чат подключился
     *
     * @param Object data {
     *   string chat_uid - UID чата
     * }
     */
    socket.on('chat:connected', function(data) {
        console.log('Socket chat:connected');

        // Добавляем переменную chat_uid к сокету
        socket.chat_uid = data.chat_uid;
    });

    /**
     * Сокет отключается
     *
     * @publish chat:disconnect
     */
    socket.on('disconnect', function () {
        console.log('Socket disconnect');

        // Если отключается пользователь
        if (socket.chat_uid) {
            // Оповещаем event сервер об отключении чата
            events.publish('chat:disconnect', { chat_uid: socket.chat_uid, widget_uid: socket.widget_uid });
        }
    });

    /**
     * Запрашиваем список чатов онлайн
     * 
     * @param Object data {
     *   string widget_uid - UID виджета
     * }
     *
     * @store SMEMBERS chats(Widget UID)
     *
     * @emit chat:online:list
     */
    socket.on('chat:online', function (data) {
        console.log('Subscribe: chat:online');

        // Получем список чатов из Redis
        events.store.hvals('chats:' + data.widget_uid, function(err, obj) {
            var chats = {};
            _.each(obj, function(e) {
                var o = JSON.parse(e);
                chats[o.chat.uid] = JSON.parse(e);
            })

            // Передаем слушателям список чатов
            io.sockets.in(data.widget_uid).emit('chat:online:list', chats);
        });
    });

    /**
     * Пользователь отправил сообщение
     *
     * @param Object data {
     *   Object person     - данные пользователя
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('chat:message:send:user', function(data) {
        console.log('Socket chat:message:send:user');

        // Оповещаем event сервер
        events.publish('chat:message:send:user', data);
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('chat:message:send:user', data);
    });

    /**
     * Агент отправил сообщение
     *
     * @param Object data {
     *   Object person     - данные агента
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('chat:message:send:agent', function(data) {
        console.log('Socket chat:message:send:agent');

        // Оповещаем event сервер
        events.publish('chat:message:send:agent', data);
        // Оповещаем слушателей
        socket.broadcast.to(data.widget_uid).emit('chat:message:send:agent', data);
    });


    /**
     * Агент подключися к чату
     *
     * @param Object data {
     *   Object person     - данные агента
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:agent:enter
     *
     * @emit chat:agent:enter
     */
    socket.on('chat:agent:enter', function(data) {
        console.log('Socket chat:agent:enter');

        // Оповещаем event сервер
        events.publish('chat:agent:enter', data);
        // Оповещаем слушателей
        socket.broadcast.to(data.widget_uid).emit('chat:agent:enter', data);
    });

    /**
     * Агент отключился от чата
     *
     * @param Object data {
     *   Object  person - персона агента,
     *   string chat   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('chat:leave:agent', function(data) {
        console.log('Socket chat:leave:agent');
    });

    return self;
};