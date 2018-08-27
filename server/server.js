const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const {ObjectID} = require('mongodb');
var moment = require("moment");
const _ = require("lodash");
var {User} = require("./models/user");
var {mongoose} = require('./db/mongoose');

var bodyParser = require('body-parser')

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
const {generateMessage, generateLocationMessage} = require("./utils/message");

var app = express();
var serverHTTP = http.createServer(app);
var io = socketIO(serverHTTP);
var authenticate = require('./middleware/middleware');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req,res) => {
  
  console.log("Usao u GET /");

  res.sendFile(publicPath+'/index.html');
});

app.get("/populate", (req,res)=>{

  var newUser = {
    _id: new ObjectID(),
    email:"ajqla94@gmail.com",
    password:"aleksa007",
    registeredAt: moment().valueOf(),
    tokens:[{
      token:"token",
      access:"auth"
    }]
  };

  User(newUser).save().then((user)=>{
    console.log(JSON.stringify(user,undefined, 2));
    res.send();
  }).catch((err)=>{
    console.log("Greska Prilikom cuvanja novog korisnika. ",err);
  });

});

app.use(express.static(publicPath));

app.post("/login", authenticate, (req,res)=>{
  
  var pickedBodyData = _.pick(req.body, ["tbEmail", "tbPassword", "novDeo"]);
  console.log(JSON.stringify(pickedBodyData,undefined, 2));

  var staJe = User.findByCredentials(pickedBodyData.tbEmail, pickedBodyData.tbPassword)
  .then((user)=>{
    console.log(JSON.stringify(user,undefined, 2));
  }).catch((error)=>{
     console.log(error);
  });
  console.log("Tip onoga sto vraca User.findByCredentials", typeof staJe);
  console.log("Rezultat onoga sto vraca", staJe);
  res.send();  
});

io.on('connection',(socket)=>{
  console.log('Novi korisnik se prikljucio');
  
  // SOCKET.EMIT EMIUJE DOGADJAJ SAMO UOKVIRU JEDNE KONEKCIJE
  // IO.EMIT EMTIJE DOGADJAJ KA SVIM MOGUCIM KONEKCIJAMA

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to our chat app.'));

  // SOCKET.BROADCAST.EMIT EMITUJE DOGADJAJ ZA SVE PRETPLACENJE OSIM ONOME KO EMITUJE TAJ DOGADJAJ.

  // socket.broadcast.emit('newMessage', generateMessage('Admin', 'Novi user se konektovao'));
  
  socket.on("createMessage", (newMsg, callback)=>{
    
    // io.emit('newMessage',generateMessage(newMsg.from, newMsg.text));
    socket.broadcast.emit('newMessage',generateMessage(newMsg.from, newMsg.text));
    callback(newMsg);
  
  });
  socket.on('createLocationMessage', (coords, callback)=>{
   // console.log(coords);
    var locationMsgObj = generateLocationMessage('Perica', coords.latitude, coords.longitude);
    //socket.broadcast.emit('newLocationMessage',locationMsgObj); TREBA OVAKO ALI SI GLUP PA ONO DOLE
    io.emit('newLocationMessage',locationMsgObj);
    callback();
  });
  socket.on("disconnect",()=>{
    console.log('Korisnik je izasao');
  });
});


serverHTTP.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
  
module.exports = {app};
  