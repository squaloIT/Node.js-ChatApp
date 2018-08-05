const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

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

  socket.emit('welcome', {
      from:'Admin',
      text:'Welcome to our chat app.', 
      createdAt: new Date().getTime()
    });

  // SOCKET.BROADCAST.EMIT EMITUJE DOGADJAJ ZA SVE PRETPLACENJE OSIM ONOME KO EMITUJE TAJ DOGADJAJ.

  socket.broadcast.emit('userConnected', {
    text:'Neki user se konektovao'
  });
  
  socket.on("createMessage", (newMsg)=>{
    console.log('Create message and send it!',newMsg);
    io.emit('newMessage',{
      from:newMsg.from,
      text:newMsg.text,
      createdAt: new Date().getTime()
    });
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
  