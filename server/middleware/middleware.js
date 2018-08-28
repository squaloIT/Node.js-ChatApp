const _ = require("lodash");
var {User} = require("./../models/user");

var authenticate = (req,res,next) => {
    var token = req.header('x-auth');
    if(token){
        User.findByToken(token).then( user => {
            if(!user){
                res.locals.authenticated = false;
                return Promise.reject();
            } 
            res.locals.authenticated = true;
            res.locals.token = user.tokens.token;
            res.locals._id = user._id;
            res.locals.email = user.email;
           
            next();
    
        }).catch( e => {
            console.log("Greska prilikom trazenja korisnika sa tokenom");
            res.status(401).send();
        });
    } else {
        next();
    }
           
};

module.exports = authenticate;