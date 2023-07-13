const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        
    },
    age: {
        type: Number,
        required: true,
    },
    sex: {
        type: String
    }
},{
    timestamps: true
});


const Patient = mongoose.model('Patient',patientSchema);


module.exports = Patient;