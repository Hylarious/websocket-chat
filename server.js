const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
  });

const io = socket(server);

const messages = [];
const users = []

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        console.log(message)
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    
    socket.on('login', (name => {
        console.log('User ' + name + ' logged with id: ' + socket.id)
        users.push({name, id: socket.id})
        socket.broadcast.emit('message', {author: 'Chat-bot', content: `User ${name} has joined the conversation!`})
    }));

    socket.on('disconnect', () => {
        const i = users.findIndex(user => {
            return user.id === socket.id
        });
        if (i !== undefined) {
            console.log('User ' + users[i].name + ' has logged off');
            socket.broadcast.emit('message', {author: 'Chat-bot', content: `User ${users[i].name} has left the conversation... :(`});
            users.splice(i, 1);
            console.log(users)
        }
    })
    console.log('I\'ve added a listener on message event \n');
  });

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
  });

  