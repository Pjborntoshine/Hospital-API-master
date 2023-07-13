const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    department:{
        type:String,
        required: true
    }
},{
    timestamps: true
});

// To remove the password from an instance when creating a jwt token

if(!doctorSchema.options.toObject) doctorSchema.options.toObject = {};
doctorSchema.options.toObject.transform = function(doc,ret,options){
    //remove password,createdAt and Updated at from every document before returning the result
    delete ret.password;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
}


const Doctor = mongoose.model('Doctor',doctorSchema);


module.exports = Doctor;