const _ = require("lodash");

var authenticate = function(req,res,next){
    // req.body.novDeo="Dobar dan od middleware-a";
    var pickedBodyData = _.pick(req.body, ["tbEmail", "tbPassword", "token"]);

    if(pickedBodyData.token){
        next();
    }


    next();
    
};

module.exports = authenticate;