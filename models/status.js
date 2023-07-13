const mongoose = require('mongoose');
const statusSchema = new mongoose.Schema({
    code: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});


const Status = mongoose.model('Status',statusSchema);
module.exports = Status;