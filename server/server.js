const path = require("path");
const publicPath = path.join(__dirname, "../public");

const express = require("express");
var app = express();
// process.env.PORT=3000;
var middleware = require('./middleware/middleware');

const port = process.env.PORT || 3000;

app.get("/", middleware, (req,res)=>{
    var porukica = req.novDeo;
    console.log(porukica);
    res.sendFile(publicPath+'/index.html');
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
  
module.exports = {app};
  