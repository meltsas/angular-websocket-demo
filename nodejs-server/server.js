'use strict';

let names = require('./names.js');

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let currentUsers = {};
const maxUsersNumber = 10;

function isTooManyUsers() {
    return (Object.keys(currentUsers).length >= maxUsersNumber);
}

function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomName(users, names) {
    let availableNames = names.filter(name => users.indexOf(name) === -1);
    return availableNames[randRange(0, availableNames.length - 1)];
}

io.on('connection', (socket) => {

    if (isTooManyUsers()) {
        io.to(socket.id).emit('message', {
            type: 'new-message',
            text: "Sorry, we are overcrowded - try again later!",
            status: "complete"
        });
        socket.disconnect();
        return false;
    }
    let userName = getRandomName(Object.keys(currentUsers).map(val => currentUsers[val]), names);
    console.log('USER CONNECTED: ' + socket.id + " - " + userName);
    currentUsers[socket.id] = userName;

    io.to(socket.id).emit('message', {
        type: 'new-message', text: "Welcome to the chat! Your alias is " + userName,
        sender: 'BOT', status: "complete", yourName: userName
    });

    // send currentUsers as array
    io.emit('message', {
        type: 'new-message',
        sender: 'BOT',
        users: Object.keys(currentUsers).map(val => currentUsers[val]),
        status: "userUpdate"
    });

    socket.on('disconnect', function () {
        console.log('USER DISCONNECTED: ' + currentUsers[socket.id]);
        delete currentUsers[socket.id];
        // send USER INFO
        io.emit('message', {
            type: 'new-message',
            sender: 'BOT',
            users: Object.keys(currentUsers).map(val => currentUsers[val]),
            status: "userUpdate"
        });
    });

    socket.on('add-message', (message) => {
        io.emit('message', {type: 'new-message', text: message, sender: currentUsers[socket.id], status: "complete"});
    });

    socket.on('typing', (message) => {
        io.emit('message', {type: 'new-message', text: message, sender: currentUsers[socket.id], status: "typing"});
    });
});

http.listen(8080, () => {
    console.log('started on port 8080');
});
