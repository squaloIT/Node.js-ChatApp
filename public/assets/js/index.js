var socket = io();
socket.on('connect', function(){
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
    // console.log(`User connected from ${message.from}, message ${message.text}.`);
    $("#chatWindow").append(`
        <div class="messageWrapper">
            <p class='othersMessage'>${message.from}: ${message.text}.</p>
        </div>`);
});
// socket.emit('createMessage', {
// 	from:'Andrijana Petakovic',
// 	text:'Jebem te u dupe.'
// }, function(){
// 	console.log("Acknowledgement");
// });

$("#btnSendMessage").click(function(e){
    socket.emit('createMessage',{
        from:'User',
        text: $("#tbMessage").val()
    }, function(message){
        $("#chatWindow").append(`
        <div class="messageWrapper">
            <p class='myMessage'>${message}.</p>
        </div>`);
    });
});