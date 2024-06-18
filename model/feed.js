const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const FeedSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    type: {type: String},
    url: {type: String},
    thumbnail: {type: String},
    hashTag: [{type: String}],
    likes:[{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    isDeleted:{type: Boolean, default: false}
},{timestamps: true});
module.exports =  main_connection.model('feed',FeedSchema);
