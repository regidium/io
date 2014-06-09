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

        // Удаляем таймер отключения
        if (io.timers['chat_' + data.chat.uid]) {
            // ===== Пользователь вернулся
            clearTimeout(io.timers['chat_' + data.chat.uid]);

            // Подключаем сокет к комнате виджета
            socket.join(data.widget_uid);

            delete io.timers['chat_' + data.chat.uid];
        } else {
            // ===== Пользователь зашел
            // Добавляем переменную widget_uid к сокету
            socket.widget_uid = data.widget_uid;
            // Добавляем переменную chat_uid к сокету
            socket.chat_uid = data.chat.uid;
            // Подключаем чат к комнате виджета
            socket.join(data.widget_uid);
            // Оповещаем event сервер о подключении чата
            events.publish('chat:connect', { chat: data.chat, widget_uid: data.widget_uid, socket_id: socket.id });
        }
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
     * Чат закрыт
     *
     * @param Object data {
     *   string chat_uid  - UID чата
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:close
     */
    socket.on('chat:close', function(data) {
        console.log('Socket chat:close');

        // Оповещаем агентов
        //socket.broadcast.to(data.widget_uid).emit('chat:closed', data);

        // Оповещаем event сервер
        events.publish('chat:close', data);
    });

    /**
     * Запрашиваем список существующих чатов
     * 
     * @param Object data {
     *   string agent_uid  - UID агента
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:existed
     */
    socket.on('chat:existed', function (data) {
        console.log('Subscribe: chat:existed');

        // Запрашивам список существующих чатов в event сервере
        events.publish('chat:existed', { widget_uid: data.widget_uid, agent_uid: data.agent_uid });
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
     * Робот отправил сообщение
     *
     * @param Object data {
     *   Object message    - данные сообщения
     *   Object chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:message:send:robot
     */
    socket.on('chat:message:send:robot', function(data) {
        console.log('Socket chat:message:send:robot');

        // Оповещаем event сервер
        events.publish('chat:message:send:robot', data);
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
     * Агент отключился от чата
     *
     * @param Object data {
     *   Object agent      - данные агента
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:agent:leave
     *
     * @emit chat:agent:leave
     */
    socket.on('chat:agent:leave', function(data) {
        console.log('Socket chat:agent:leave');

        // Оповещаем event сервер
        events.publish('chat:agent:leave', data);
        // Оповещаем слушателей
        socket.broadcast.to(data.widget_uid).emit('chat:agent:leave', data);
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
     * Изменена страница чата
     *
     * @param Object data {
     *   string new_url    - URL сайта
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:url:change
     *
     * @emit chat:url:change
     */
    socket.on('chat:url:change', function(data) {
        console.log('Socket chat:url:change');

        // Оповещаем event сервер
        events.publish('chat:url:change', data);
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('chat:url:change', data);
    });

    /**
     * Изменен referrer сайта
     *
     * @param Object data {
     *   string referrer   - Referrer сайта
     *   string chat_uid   - UID чата
     *   string widget_uid - UID виджета
     * }
     *
     * @publish chat:referrer:change
     *
     * @emit chat:referrer:change
     */
    socket.on('chat:referrer:change', function(data) {
        console.log('Socket chat:referrer:change');

        // Оповещаем event сервер
        events.publish('chat:referrer:change', data);
    });

    /**
     * Пользователе прочел сообщение агента
     *
     * @param Object data {
     *   string message_uid - UID сообщения
     *   string chat_uid    - UID чата
     *   string widget_uid  - UID виджета
     * }
     * 
     * @publish chat:message:readed
     *
     * @emit chat:message:readed:user
     */
    socket.on('chat:message:read:user', function(data) {
        console.log('Socket chat:message:read:user');

        if (data && data.event_send) {
            // Оповещаем event сервер
            events.publish('chat:message:readed', data);
        }
        // Оповещаем агентов
        socket.broadcast.to(data.widget_uid).emit('chat:message:readed:user', data);
    });

    /**
     * Агент прочел сообщение пользователя
     *
     * @param Object data {
     *   string message_uid - UID сообщения
     *   string chat_uid    - UID чата
     *   string widget_uid  - UID виджета
     * }
     * 
     * @publish chat:message:readed
     *
     * @emit chat:message:readed:agent
     */
    socket.on('chat:message:read:agent', function(data) {
        console.log('Socket chat:message:read:agent');

        if (data && data.event_send) {
            // Оповещаем event сервер
            events.publish('chat:message:readed', data);
        }
        // Оповещаем о прочтении сообщения
        socket.broadcast.to(data.widget_uid).emit('chat:message:readed:agent', data);

        //socket.broadcast.to(data.widget_uid).emit('chat:message:remove:new', data);
        io.sockets.in(data.widget_uid).emit('chat:message:remove:new', data);
    });

    return self;
};