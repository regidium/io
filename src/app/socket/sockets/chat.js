var _ = require('underscore');

var self = module.exports = function (io, socket, events)
{
    /**
     * Чат создается
     * 
     * @param Object data {
     *   Object chat       - данные чата
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:create
     */
    socket.on('chat:create', function(data) {
        console.log('Socket chat:create');

        // Добавляем переменную widget_uid к сокету
        socket.widget_uid = data.widget_uid;
        // Подключаем сокет к комнате виджета
        socket.join(data.widget_uid);
        // Оповещаем event сервер о необходимости создать пользователя и чат
        events.publish('chat:create', { widget_uid: data.widget_uid, chat: data.chat, socket_id: socket.id });
    });

    /**
     * Чат подключается
     *
     * @param Object data {
     *   Object chat       - данные чата
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
        events.publish('chat:connect', { chat: data.chat, widget_uid: data.widget_uid, socket_id: socket.id });
    });

    /**
     * Чат подключился
     *
     * @param Object data {
     *   string chat - данные чата
     * }
     */
    socket.on('chat:connected', function(data) {
        console.log('Socket chat:connected');

        // Добавляем переменную chat_uid к сокету
        socket.chat_uid = data.chat_uid;
    });

    /**
     * Сокет отключился
     *
     * @publish chat:disconnect
     */
    socket.on('disconnect', function () {
        console.log('Socket disconnect');

        // Если отключается пользователь
        if (socket.chat_uid) {
            // Оповещаем агентов
            socket.broadcast.to(socket.widget_uid).emit('chat:disconnect', { chat_uid: socket.chat_uid, widget_uid: socket.widget_uid });
            // Оповещаем event сервер об отключении чата
            events.publish('chat:disconnect', { chat_uid: socket.chat_uid, widget_uid: socket.widget_uid });
        }
    });

    /**
     * Запрашиваем список существующих чатов
     * 
     * @param Object data {
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:existed
     */
    socket.on('chat:existed', function (data) {
        console.log('Subscribe: chat:existed');

        // Запрашивам список существующих чатов в event сервере
        events.publish('chat:existed', { widget_uid: data.widget_uid });
    });

    /**
     * Запрашиваем список online чатов
     * 
     * @param Object data {
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:online
     */
    socket.on('chat:online', function (data) {
        console.log('Subscribe: chat:online');

        // Запрашивам список online чатов в event сервере
        events.publish('chat:online', { widget_uid: data.widget_uid });
    });

    /**
     * Запрашиваем список архивных чатов
     * 
     * @param Object data {
     *   string chat_uid - UID чата
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:archives
     */
    socket.on('chat:archives', function (data) {
        console.log('Subscribe: chat:archives');

        // Оповещаем event сервер
        events.publish('chat:archives', data);
    });

    /**
     * Пользователь отправил сообщение
     *
     * @param Object data {
     *   Object message    - данные сообщения
     *   Object chat       - данные чата
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:message:send:user
     *
     * @emit chat:message:send:user
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
     *   Object message    - данные сообщения
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:message:send:agent
     *
     * @emit chat:message:send:agent
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
     *   Object agent      - данные агента
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
     * @todo Реализовать
     * Агент отключился от чата
     *
     * @param Object data {
     *   Object agent      - данные агента,
     *   string chat       - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('chat:leave:agent', function(data) {
        console.log('Socket chat:leave:agent');
    });

    /**
     * Пользователь ввел авторизационные данные
     *
     * @param Object data {
     *   Object chat       - данные чата
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:user:auth
     */
    socket.on('chat:user:auth', function(data) {
        console.log('Socket chat:user:auth');

        // Оповещаем event сервер
        events.publish('chat:user:auth', { user: data.user, chat_uid: data.chat_uid, widget_uid: data.widget_uid, socket_id: socket.id });
    });

    /**
     * @TODO дореализовать
     * Изменена страница чата
     *
     * @param Object data {
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     */
    socket.on('chat:page:change', function(data) {
        console.log('Socket chat:page:change');

        // Оповещаем event сервер
        events.publish('chat:page:changed', { chat_uid: data.chat_uid, widget_uid: data.widget_uid });
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('chat:destroy', data);
    });

    return self;
};