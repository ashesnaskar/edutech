const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const MessageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    message: { type: String },
    created: { type: String }
}, { timestamps: true });
MessageSchema.accessKeyId = 'access_key';

module.exports = main_connection.model('message', MessageSchema);
