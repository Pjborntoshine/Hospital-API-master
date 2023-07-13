const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
    
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    patient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    Date: {         
        type: String,        
    },
    Time: {         
        type: String,               
    }
    
},{
    timestamps: true
});


const Report = mongoose.model('Report',reportSchema);
module.exports = Report;