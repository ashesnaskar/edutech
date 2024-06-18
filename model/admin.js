const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const AdminSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    email_verified: {type: Boolean,default: false},
    password: {type: String,required:true},
    img_url: {type: String},
    type: {type: String, default: 'Super Admin'},
    isDeleted: {type: Boolean, default: false},
},{timestamps: true});
module.exports =  main_connection.model('admin',AdminSchema);
