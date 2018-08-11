var socket = io();

// socket.on('disconnect',function(){
//     console.log('Server se iskljucio sa soketa.');
// });
var othersMessageTemplate = $("#others-message-template").html();
var myMessageTemplate = $("#my-message-template").html(); 
var locationMessageTemplate = $("#location-message-template").html(); 

socket.on('newMessage', function(message){
    
    var formattedCreatedAt = moment(message.createdAt).format('h:mm a');
    // $("#chatWindow").append(`
    //     <div class="messageWrapper">
    //         <p class='othersMessage'>${message.from} ${formattedTime}: ${message.text}.</p>
    //     </div>`);
    console
    var html = Mustache.render(othersMessageTemplate, {
        from: message.from,
        formattedCreatedAt,
        text: message.text
    });
    $("#chatWindow").append(html);
});

$("#btnSendMessage").click(function(e){
    var tbMessageSelector = $("#tbMessage");
    socket.emit('createMessage',{
        from:'User',
        text: tbMessageSelector.val()
    }, function(message){
        
        // $("#chatWindow").append(`
        // <div class="messageWrapper">
        //     <p class='myMessage'>${moment(message.createdAt).format("h:mm a")} ${message.text}.</p>
        // </div>`);
        console.log(moment(message.createdAt).format("h:mm a"));
        var html = Mustache.render(myMessageTemplate, {
            formattedCreatedAt: moment(message.createdAt).format("h:mm a"),
            text: message.text
        });
        $("#chatWindow").append(html);
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

    var formattedTime = moment(message.createdAt).format("h:mm a");
    var html = Mustache.render(locationMessageTemplate, {
        from: message.from,
        formattedCreatedAt: formattedTime,
        text: message.text,
        url: message.url
    });
    $('#chatWindow').append(html);
});