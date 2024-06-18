const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const SubscriptionSchema = mongoose.Schema({
    questions: [
        {
            question: {type: String},
            option: [{type: String}],
            answer: [{type: String}],
            marks: {type: Number}
        }
    ],
    valid_to: {type:Date},
    course_id: {type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    title: {type: String},
    live: {type: Boolean, default: false},
    total_marks: {type: Number},
    time: {type: Number}
},{timestamps: true});
module.exports =  main_connection.model('quiz',SubscriptionSchema);
