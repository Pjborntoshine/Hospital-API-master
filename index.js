const express = require('express');
const app = express();
const port = 8000;
const db = require('./config/mongoose');
const passport = require('passport');
const passportJWT = require('./config/passport-jwt-stratergy');


app.use(express.urlencoded({extended: true}));
app.use(express.json());

//use the assets folder for static files 
app.use(express.static('./assets'));



//use express router 
app.use("/",require('./routes'));


app.listen(port,function(err){
    if(err)
        console.log("Error Starting the server");
    
    console.log('Server is up and running at port:', port);
});
module.exports = app;