var socket = io();
socket.on('connect', function(){
    console.log('Konektovan na server');

    // socket.emit("createMessage",{
    //     from:'Pera@gmail.com',
          //  to:'cofiZmaj'
    //     text:"Cao cao"
    // });
});
socket.on('disconnect',function(){
    console.log('Server se iskljucio sa soketa.');
});

socket.on('newMessage', function(message){
    console.log('New message! ',message);
});
socket.on('welcome', function(message){
    console.log(message.from);
    console.log(message.text);
});
socket.on('userConnected', function(message){
    console.log(message);
});