var {mongoose} = require('./../db/mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email.'
        }
    },
    password: {
        type: String,
        require:true,
        minlength: 6
    },
    registeredAt: {
        type: Number,
        required: true
    },
    tokens: [{
        access: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
      }]
});

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = "auth";
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat([{access,token}]);
    return user.save().then(()=>{
        return token;
    });
};

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;

    try {
        decoded = jwt.decode(token, process.env.JWT_SECRET);
    } catch(e){
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access':'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    // var query = User.findOne({email});
    // // return Promise.resolve();
    // var promise = query.exec();
    return User.findOne({email}).then((user)=>{
       
        if(!user){
            return Promise.reject("Nije pronadjen user sa tim email-om.");
        }
       
        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
              if (res) {
                resolve(user);
              } else {
                reject();
              }
            });
          });
        
    }, (err)=>{ 
        return Promise.reject(`Nije pronadjen korisnik sa tim email-om ${err}`);
    }).catch((err)=>{
        return Promise.reject(`Nije pronadjen korisnik sa tim email-om i usli smo u catch ${err}`);
    });
};

UserSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password, salt, (err,hash)=>{
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model("User", UserSchema);
module.exports = {User};
