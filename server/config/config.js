var configJSON = require("./config.json");

var config = configJSON['development'];
Object.keys(config).forEach(function(key){
    process.env[key]=config[key];
});
