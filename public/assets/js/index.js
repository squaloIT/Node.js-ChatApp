var socket = io();
var othersMessageTemplate = $("#others-message-template").html();
var myMessageTemplate = $("#my-message-template").html(); 
var locationMessageTemplate = $("#location-message-template").html(); 

function scrollToBottom(){
    var chatWindow = $("#chatWindow");
    var newMessage = chatWindow.children('.messageWrapper:last-child');

    var scrollTop = chatWindow.prop('scrollTop');
    var scrollHeight = chatWindow.prop('scrollHeight');
    var clientHeight = chatWindow.prop('clientHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        // console.log("Should scroll");
        chatWindow.scrollTop(scrollHeight);
    }
}
//GORNJA FUNKCIJA NAM OMOGUCAVA DA AUTOSKROLUJEMO KORISNIKA KA POSLEDNJOJ PORUCI, DA NE MORA ON DA SKROLUJE NON STOP
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
        scrollToBottom();
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
    scrollToBottom();
});