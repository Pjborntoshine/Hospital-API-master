const passport = require('passport');
const JWTStratergy = require('passport-jwt').Strategy;
const ExtratctJWT = require('passport-jwt').ExtractJwt;

const Doctor = require('../models/doctor');

let opts = {
    jwtFromRequest: ExtratctJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'random_string' 
}


passport.use(new JWTStratergy(opts, function(jwtPayLoad, done){

    Doctor.findById(jwtPayLoad._id, function(err,user){
        if(err){console.log('Error in finding user from JWT'); return;}

        if(user){
            return done(null,user);
        }else{
            return done(null, false);
        }
    });
}));

module.exports = passport;