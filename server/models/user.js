var {mongoose} = require('./../db/mongoose');
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

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    var query = User.findOne({email});
    // return Promise.resolve();

    console.log("Da li je query promise:",query instanceof Promise);
    var promise = query.exec();

    console.log("Da li je query.exec() promise:", promise instanceof Promise);
    return promise.then((user)=>{
        if(!user){
            console.log("Nije pronadjen user sa tim email-om.");
            return Promise.reject();
        }
        console.log("User nije jednak false i prelazimo na return novog promise-a()");

        // Use bcrypt.compare to compare password and user.password
        bcrypt.compare(password, user.password, (err, res) => {
            console.log("rezultat rada bcrypt compare: ",res);
            if (res) {
                return Promise.resolve(user);
            } else {
                return Promise.reject();
            }
        });
        
    }, (err)=>{ 
        console.log("Nije pronadjen korisnik sa tim email-om",err);
        return Promise.reject(err);
        
    }).catch((err)=>{
        console.log("Nije pronadjen korisnik sa tim email-om i usli smo u catch",err);
        return Promise.reject(err);
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
