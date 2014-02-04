var self = module.exports = {};
var _ = require('underscore');

// export function for listening to the socket
self.init = function (io) {
    self.io = io;
    /** Все online пользователи */
    self.users = {};
    /** Все online агенты */
    self.agents = {};
    /** Все online чаты */
    self.chats = {};
}

self.run = function (socket) {
    // Пользователь подключился
    socket.on('agent:connected', function(data) {
        /** @todo Передать агенту список ожидающих */
        socket.agent = data;
        socket.widget = data.agent.agent.widget.uid;
        self.agents[socket.agent.uid] = socket;
    });

    // Пользователь подключился
    socket.on('user:connected', function(data) {
        if (!self.users[data.widget]) {
            self.users[data.widget] = {};
        }
        socket.user = data.person;
        socket.widget = data.widget;
        // Добавляем пользователя в список пользователей онлайн
        self.users[data.widget][data.person.uid] = data;
        // Оповещаем агентов о подключении пользователя
        socket.broadcast.emit('user:connected', data);
    });

    // Агент покинул чат
    socket.on('agent:chat:exited', function(data) {
        socket.leave(data.chat);
        // Оповестить пользователя о выходе агента
        socket.broadcast.to(data.chat).emit('agent:chat:exited', data);
    });

    /** @todo REFACTORING!!! */
    socket.on('user:logined', function(data) {
        /** @todo Оповестить всех агентов, о входе пользователя */
        socket.user = data;
        self.users[socket.user.uid] = socket;
    });

    socket.on('user:registered', function(data) {
        /** @todo реализовать */
    });

    socket.on('user:logined', function(data) {
        /** @todo реализовать */
    });

    socket.on('user:edited', function(data) {
        /** @todo реализовать */
    });

    socket.on('user:edited', function(data) {
        /** @todo реализовать */
    });

    // Пользователь обновил страницу
    socket.on('user:refreshed', function(data) {
        console.log(data);
        socket.broadcast.emit('user:refreshed', data);
    });

    // Пользователь создал чат
    socket.on('chat:created', function(data) {
        if (!self.chats[data.widget]) {
            self.chats[data.widget] = {}
        }
        // Добавляем чат в список чатов виджета
        self.chats[data.widget][data.chat.uid] = data;
        // Подключаем пользователя к своему чату
        socket.join(data.chat.uid);
        // Оповещаем пользователей о создании чата
        socket.broadcast.emit('chat:created', data);
    });

    // Пользователь открыл чат
    socket.on('chat:started', function(data) {
        /** @todo реализовать */
        if (!self.chats[data.widget]) {
            self.chats[data.widget] = {}
        }
        // Добавляем чат в список чатов виджета
        self.chats[data.widget][data.chat.uid] = data;
        // Подключаем пользователя к своему чату
        socket.join(data.chat.uid);
        // Оповещаем агентов об открытии чата
        socket.broadcast.emit('chat:started', data);
    });

    // Чат закрыт
    /** @todo реализовать */
    socket.on('chat:ended', function(data) {
        // Отключаем пользователя от чата
        socket.leave(data.chat.uid);
        if (self.chats[data.widget]) {
            // Удаляем чат из списка чатов
            delete self.chats[data.widget][data.chat];
        }
        // Оповещаем о закрытии чата
        socket.broadcast.emit('chat:ended', data);
    });

    // Чат уничтожен
    socket.on('chat:destroyed', function(data) {
        console.log(self.chats[data.widget]);
        if (self.chats[data.widget]) {
            // Удаляем чат из списка чатов
            delete self.chats[data.widget][data.chat];
        }
        // Оповещаем об уничтожении чата
        socket.broadcast.emit('chat:destroyed', data);
    });

    socket.on('chat:message:created', function(data) {
        /** @todo реализовать */
    });

    socket.on('chat:message:readed', function(data) {
        /** @todo реализовать */
    });

    socket.on('chat:message:removed', function(data) {
        /** @todo реализовать */
    });

    // ========================================= //
    // Выдаем список чатов
    socket.on('chats:online', function(data, cb) {
        if (self.chats[data]) {
            cb(self.chats[data]);
        } else {
            cb([]);
        }
    });

    // Выдаем список чатов
    socket.on('users:online', function(data, cb) {
        if (self.users[data]) {
            cb(self.users[data]);
        } else {
            cb([]);
        }
    });

    // Подключаем агента к чату
    socket.on('chat:agent:enter', function(data) {
        socket.join(data.chat);
        socket.broadcast.to(data.chat).emit('chat:agent:enter', data)
    });

    // Пользователя написал сообщение
    socket.on('chat:user:message:send', function (data) {
        // Оповещаем агента о сообщении пользователя
        console.log('chat:user:message:send', data.chat);
        socket.broadcast.to(data.chat).emit('chat:user:message:send', data)
    });

    // Агент написал сообщение
    socket.on('chat:agent:message:send', function (data) {
        // Оповещаем пользователя о сообщении агента
        socket.broadcast.to(data.chat).emit('chat:agent:message:send', data)
    });

    /** @todo REFACTORING!!! */
    socket.on('disconnect', function () {
        if (socket.user) {
            delete self.users[socket.widget][socket.user.uid];
/*            var chats = Object.keys(self.io.sockets.manager.roomClients[socket.user.uid]).map(function(room) { return room.replace('/', ''); });
            socket.broadcast.emit('user:exited', {uid: socket.user.uid});
            _.each(chats, function(uid) {
                socket.broadcast.emit('chat:destroyed', {uid: uid});
                delete self.chats[socket.widget][uid];
            });*/
        }
        if (socket.agent) {
            delete self.agents[socket.widget][socket.agent.agent.uid];
        }
    });
};