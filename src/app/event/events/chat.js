var self = module.exports = function (events, io)
{
    /**
     * Event сервер сообщил о создании чата
     * @param Object data = {
     *       string chat       - данные чата
     *       string person     - данные пользователя
     *       string widget_uid - UID виджета
     *       string socket_id  - ID сокета
     *   }
     *
     * @emit chat:created
     */
    events.subscribe('chat:created', function (data) {
        console.log('Subscribe: chat:created');

        // Оповещаем слушателей о создании чата
        //io.sockets.in(data.widget_uid).sockets[data.socket_id].emit('chat:created', data);

        // Оповещаем слушателей о создании чата
        io.sockets.in(data.widget_uid).emit('chat:created', data);
    });

    /**
     * Event сервер сообщил о подключении чата
     * @param Object data = {
     *       Object chat       - данные чата
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:connected
     */
    events.subscribe('chat:connected', function (data) {
        console.log('Subscribe: chat:connected');

        // Оповещаем слушателей о подключении чата
        io.sockets.in(data.widget_uid).emit('chat:connected', data);
    });

    /**
     * Event сервер сообщил о закрытии чата
     * @param Object data = {
     *       string chat_uid   - UID чата
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:closed
     */
    events.subscribe('chat:closed', function (data) {
        console.log('Subscribe: chat:closed');

        // Оповещаем слушателей о закрытии чата
        io.sockets.in(data.widget_uid).emit('chat:closed', data);
    });

    /**
     * Event сервер сообщил об отключении чата
     * @param Object data = {
     *       string chat_uid   - UID чата
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:disconnected
     */
    events.subscribe('chat:disconnected', function (data) {
        console.log('Subscribe: chat:disconnected');

        // Оповещаем слушателей об отключении чата
        io.sockets.in(data.widget_uid).emit('chat:disconnected', data);
    });

    /**
     * Event сервер сообщил об подключении агента к чату
     * @param Object data = {
     *       Object chat       - данные чата
     *       Object person     - данные агента
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:agent:entered
     */
    events.subscribe('chat:agent:entered', function (data) {
        console.log('Subscribe: chat:agent:entered');

        // Оповещаем слушателей о подключении агента к чату
        io.sockets.in(data.widget_uid).emit('chat:agent:entered', data);
    });

    /**
     * Event сервер сообщил об отключении агента от чата
     * @param Object data = {
     *       Object agent      - данные агента
     *       string chat_uid   - UID чата
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:agent:leaved
     */
    events.subscribe('chat:agent:leaved', function (data) {
        console.log('Subscribe: chat:agent:leaved');

        // Оповещаем слушателей об отключнии агента от чата
        io.sockets.in(data.widget_uid).emit('chat:agent:leaved', data);
    });

    /**
     * Event сервер вернул список существующих чатов
     * @param Object data = []
     *
     * @emit chat:existed:list
     */
    events.subscribe('chat:existed:list', function (data) {
        console.log('Subscribe: chat:existed:list');

        // Возвращаем слушателям список существующих чатов
        io.sockets.in(data.widget_uid).emit('chat:existed:list', data);
    });

    /**
     * Event сервер вернул список online чатов
     * @param Object data = [
     *            array chats
     *            string widget_uid
     *        ]
     *
     * @emit chat:online:list
     */
    events.subscribe('chat:online:list', function (data) {
        console.log('Subscribe: chat:online:list');

        // Возвращаем слушателям список online чатов
        io.sockets.in(data.widget_uid).emit('chat:online:list', data);
    });

    /**
     * Event сервер вернул список архивных чатов
     * @param Object data = []
     *
     * @emit chat:archives:list
     */
    events.subscribe('chat:archives:list', function (data) {
        console.log('Subscribe: chat:archives:list');

        // Возвращаем слушателям список архивных чатов
        io.sockets.in(data.widget_uid).emit('chat:archives:list', data);
    });

    /**
     * Event сервер сообщил о изменении пользовательских данных
     * @param Object data = {
     *       string user       - данные пользователя
     *       string chat_uid   - UID чата
     *       string widget_uid - UID виджета
     *       string socket_id  - ID сокета
     *   }
     *
     * @emit user:auth:entered
     */
    events.subscribe('chat:user:authed', function (data) {
        console.log('Subscribe: chat:user:authed');

        // Оповещаем слушателей о создании чата
        io.sockets.in(data.widget_uid).emit('chat:user:authed', data);
    });

    /**
     * Event сервер сообщил о записи сообщения пользователя
     * @param Object data = {
     *       Object message    - данные сообщения
     *       string chat_uid   - UID чата
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:message:sended:user
     */
    events.subscribe('chat:message:sended:user', function (data) {
        console.log('Subscribe: chat:message:sended:user');

        // Оповещаем новом сообщении
        io.sockets.in(data.widget_uid).emit('chat:message:sended:user', data);
        io.sockets.in(data.widget_uid).emit('chat:message:add:new', data);
    });

    /**
     * Event сервер сообщил о записи сообщения агента
     * @param Object data = {
     *       Object message    - данные сообщения
     *       string chat_uid   - UID чата
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:message:sended:agent
     */
    events.subscribe('chat:message:sended:agent', function (data) {
        console.log('Subscribe: chat:message:sended:agent');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('chat:message:sended:agent', data);
    });

    /**
     * Event сервер сообщил о записи сообщения робота
     * @param Object data = {
     *       Object message    - данные сообщения
     *       string chat_uid   - UID чата
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:message:sended:robot
     */
    events.subscribe('chat:message:sended:robot', function (data) {
        console.log('Subscribe: chat:message:sended:robot');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('chat:message:sended:robot', data);
    });

    /**
     * Referrer сайта изменен
     * @param Object data = {
     *       string referrer   - Referrer сайта
     *       string keywords   - Ключевые слова
     *       string chat_uid   - UID чата
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:referrer:changed
     */
    events.subscribe('chat:referrer:changed', function (data) {
        console.log('Subscribe: chat:referrer:changed');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('chat:referrer:changed', data);
    });

    /**
     * Изменился статус чата
     * @param Object data = {
     *       string chat       - данные чата
     *       string widget_uid - UID виджета
     *   }
     *
     * @emit chat:status:changed
     */
    events.subscribe('chat:status:changed', function (data) {
        console.log('Subscribe: chat:status:changed');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('chat:status:changed', data);
    });

    /**
     * Ошибка получения чата
     * @param Object data
     *
     * @emit chat:status:changed
     */
    events.subscribe('chat:error:sended', function (data) {
        console.log('Subscribe: chat:error:sended');

        // Оповещаем слушателей
        io.sockets.in(data.widget_uid).emit('chat:error:sended', data);
    });

    return self;
};