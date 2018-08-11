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
    
    var formattedTime = moment(message.createdAt).format('h:mm a');
    $("#chatWindow").append(`
        <div class="messageWrapper">
            <p class='othersMessage'>${message.from} ${formattedTime}: ${message.text}.</p>
        </div>`);
});
// socket.emit('createMessage', {
// 	from:'Andrijana Petakovic',
// 	text:'Jebem te u dupe.'
// }, function(){
// 	console.log("Acknowledgement");
// });

$("#btnSendMessage").click(function(e){
    var tbMessageSelector = $("#tbMessage");
    socket.emit('createMessage',{
        from:'User',
        text: tbMessageSelector.val()
    }, function(message){
        console.log(message);
        $("#chatWindow").append(`
        <div class="messageWrapper">
            <p class='myMessage'>${moment(message.createdAt).format("h:mm a")} ${message.text}.</p>
        </div>`);
        tbMessageSelector.val('');
    });
});
var locationButton = $("#btnGeolocation");
locationButton.click(function(){
    if(!navigator.geolocation){
        return alert("Geolocation is not supported");
    }

    locationButton.attr("disabled","disabled");
    locationButton.val("Sending location...");

    navigator.geolocation.getCurrentPosition(function(position){
        console.log(position.coords);
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function(){
            locationButton.removeAttr("disabled").val("Send location");
		});
    }, function(err){
        locationButton.removeAttr("disabled").val("Send location");
        console.log(err);
    });
    
});
socket.on('newLocationMessage', function(message){
	
	var div = $("<div class='messageWrapper'></div>");
	var p = $("<p class='othersMessage'></p>");
    var a = $("<a target='_blank'> My current location</a>");
    var formattedTime = moment(message.createdAt).format("h:mm a");

	p.text(`${message.from} ${formattedTime}: `);
	a.attr("href", message.url);
	p.append(a);
	div.append(p);
	$('#chatWindow').append(div);
});