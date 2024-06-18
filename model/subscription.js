const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const SubscriptionSchema = mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    course_id: {type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    batch_id: {type: mongoose.Schema.Types.ObjectId, ref: 'batch'},
    end_date: {type: Date}
},{timestamps: true});
module.exports =  main_connection.model('subscription',SubscriptionSchema);
