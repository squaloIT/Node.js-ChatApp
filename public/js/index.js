var socket = io();
socket.on('connect', function(){
    console.log('Konektovan na server');

    socket.emit("createMessage",{
        to:'Pera@gmail.com',
        text:"Cao cao"
    });
});
socket.on('disconnect',function(){
    console.log('Server se iskljucio sa soketa.');
});

socket.on('newMsg', function(data){
    console.log('New message! Text: ',data.text);
});