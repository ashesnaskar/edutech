const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const UserSchema = mongoose.Schema({
    name: {type: String},
    phone_no: {type: String, required: true, unique: true},
    email: {type: String, unique: true},
    email_verified: {type: Boolean,default: false},
    birthday: {type: Date},
    img_url: {type: String},
    otp: {type: Number},
    expireIn: {type: Date},
    deviceId: [{type: String}],
    device:[{type: String}],
    isDeleted: {type: Boolean, default: false},
    address: {
        line: {type: String},
        city: {type: String},
        state: {type: String},
        pincode: {type: String}
    },
    course: [{
        name: {type: String},
        batch_name: {type: String}
    }],
    roll_no: {type: String},
    type: {type: String, default: 'User'},
    dues: [
        {
            amount: {type: Number},
            dueDate: {type: Date}
        }
    ],
    total_due_amount: {type: Number, default: 0}

},{timestamps: true});
module.exports =  main_connection.model('user',UserSchema);

