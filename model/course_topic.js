const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const courseTopicSchema = mongoose.Schema({
    topic_name: {type: String, required: true},
    img_url: {type: String, required: true},
    course_id: {type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    videos:[{type: mongoose.Schema.Types.ObjectId, ref: 'course'}]
},{timestamps: true});
module.exports =  main_connection.model('course_topic',courseTopicSchema);
