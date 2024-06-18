const mongoose = require('mongoose');
const main_connection = require('../config/config').mainDb;

const classSchema = mongoose.Schema({
    batch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'batch' },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
    attented_user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    class_taken_by: { type: String },
    time: { type: Date, required: true },
    class_join_link: { type: String, required: true }
}, { timestamps: true });
classSchema.accessKeyId = 'access_key';
module.exports = main_connection.model('class', classSchema);


