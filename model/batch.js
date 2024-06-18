const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const BatchSchema = mongoose.Schema({
    course_id: {type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    userId: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    batch_name: {type: String,required: true}
},{timestamps: true});
module.exports =  main_connection.model('batch',BatchSchema);
