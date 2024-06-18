const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const videoContentSchema = mongoose.Schema({
  title: {type: String,required: true},
  description: {type: String},
  url: {type: String,required: true},
  attachment_url: {type: String},
  thumbnail:{type: String},
  topic_id: {type: mongoose.Schema.Types.ObjectId, ref: 'course_topic'},
  course_id: {type: mongoose.Schema.Types.ObjectId, ref: 'course'}
},{timestamps: true});
module.exports =  main_connection.model('video_content',videoContentSchema);
