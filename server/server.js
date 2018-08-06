const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
const {generateMessage} = require("./utils/message");

var app = express();
var serverHTTP = http.createServer(app);
var io = socketIO(serverHTTP);
var middleware = require('./middleware/middleware');

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('Novi korisnik se prikljucio');
  
  // SOCKET.EMIT EMIUJE DOGADJAJ SAMO UOKVIRU JEDNE KONEKCIJE
  // IO.EMIT EMTIJE DOGADJAJ KA SVIM MOGUCIM KONEKCIJAMA


  // socket.emit('newMessage', {
  //   from:'mike@example.com',
  //   text:'S"ima ',
  //   createAt: 123
  // });

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to our chat app.'));

  // SOCKET.BROADCAST.EMIT EMITUJE DOGADJAJ ZA SVE PRETPLACENJE OSIM ONOME KO EMITUJE TAJ DOGADJAJ.

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'Novi user se konektovao'));
  
  socket.on("createMessage", (newMsg, callback)=>{
    console.log('Create message and send it!',newMsg);
    io.emit('newMessage',generateMessage(newMsg.from, newMsg.text));
    callback();
    // io.emit('newMessage',{
    //   from:newMsg.from,
    //   text:newMsg.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on("disconnect",()=>{
    console.log('Korisnik je izasao');
  });
});

// app.get("/", middleware, (req,res)=>{
//     var porukica = req.novDeo;
//     console.log(porukica);
//     res.sendFile(publicPath+'/index.html');
// });

serverHTTP.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
  
module.exports = {app};
  