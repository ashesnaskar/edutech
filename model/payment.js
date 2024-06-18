const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const paymentSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:'user'},
    paymentObj: {type: Object},
    status: {type: String}
},{timestamps: true});
module.exports =  main_connection.model('payment',paymentSchema);
