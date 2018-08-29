const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require("./utils/users");

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');


  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room); //dovoljna je ova linija koda kako bi se prikljucili u neku sobu
    // socket.leave("Ime grupe"); // ovako se izlazi iz neke sobe

    // io.emit(); //Salje poruku svima
    // io.to("Ime grupe").emit -> Salje poruku svima iz grupe Ime grupe

    // socket.broadcast.emit() //Salje poruku svima sem samom sebi
    // socket.broadcast.to("Ime grupe").emit -> Salje poruku svima u grupi sem samom sebi

    // socket.emit() //Salje poruku samo jednom useru.
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserNamesList(params.room)); // OVIM SALJEM DOGADJAJ SAMO LJUDIMA IZ SOBE DA SE TREBA UPDATE-OVATI LISTA USERA SA LISTOM KOJOM PROSLEDJUJEM KAO POSL PARAM.

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined the room`));
    
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit("updateUserList", users.getUserNamesList(user.room));
      io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left the room.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
