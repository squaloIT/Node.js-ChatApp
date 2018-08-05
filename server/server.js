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
  // console.log(socket);
  socket.on("disconnect",()=>{
    console.log('Korisnik je izasao');
  });
});
// io.on('disconnection',()=>{
//   console.log('Korisnik je izasao');
// });
// app.get("/", middleware, (req,res)=>{
//     var porukica = req.novDeo;
//     console.log(porukica);
//     res.sendFile(publicPath+'/index.html');
// });

serverHTTP.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
  
module.exports = {app};
  