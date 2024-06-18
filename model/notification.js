const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const NotiSchema = mongoose.Schema({
    title: {type: String},
    description: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
},{timestamps: true});
module.exports =  main_connection.model('notification',NotiSchema);
