const mongoose = require('mongoose');
const Status = require('../models/status');
let config = require('config');
// let options = { 
//     server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
//     replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
//   }; 

mongoose.connect(config.DBHost, {useNewUrlParser: true, useUnifiedTopology: true} );

const db = mongoose.connection;


db.on('error', console.error.bind(console,"Error connecting to MongoDB"));

db.once('open', function(){
    console.log('Connected to DB::MongoDB' );
})


//configures the status table
Status.findOne({code:0},function (err, status){
    if(err){
        console.log(err)
    }
    if(status){
        console.log('Status table is already configured');
        return;
    }
    if(!status){
        new Status({ code: '0',name:'Negative' }).save(function (err) {
            if (err){
                console.log(err);
            };
            
        });
        new Status({ code: '1',name:'Travelled-Quarantine' }).save(function (err) {
            if (err){
                console.log(err);
            };
            
        });
        new Status({ code: '2',name:'Symptoms-Quarantine' }).save(function (err) {
            if (err){
                console.log(err);
            };
            
        });
        new Status({ code: '3',name:'Positive-Admit' }).save(function (err) {
            if (err){
                console.log(err);
            };
            
        });
        console.log('Status table configured');
    }
})



module.exports = db;