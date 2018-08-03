var middleware = function(req,res,next){
    req.novDeo="Dobar dan od middleware-a";
    next();
};

module.exports = middleware;