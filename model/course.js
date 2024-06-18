const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const CourseSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String,required: true},
    img_url: {type: String},
    total_students: {type: Number, default: 0},
    teachers:[{type:String}]
},{timestamps: true});
module.exports =  main_connection.model('course',CourseSchema);
