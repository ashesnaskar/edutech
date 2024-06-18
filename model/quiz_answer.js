const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const SubscriptionSchema = mongoose.Schema({
    quiz_id: {type: mongoose.Schema.Types.ObjectId, ref: 'quiz'},
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    questions: [{
        answer: [{type: String}],
        status: {type: String, default: 'Not Answered'},
        marks: {type: Number, default: 0},
        correct: [{type: String}]
    }],
    start_time: {type: Date, default: Date.now()},
    end_time: {type: Date},
    isEnded: {type: Boolean, default: false},
    total_marks: {type: Number},
    obtained_marks: {type: Number, default: 0}
},{timestamps: true});
module.exports =  main_connection.model('quiz_answer',SubscriptionSchema);
