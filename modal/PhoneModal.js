const mongoose = require('mongoose')

const phoneSchema = new mongoose.Schema({
    phone: String,
    otp: String
}, { timestamps: true })


module.exports = mongoose.model('Phone', phoneSchema);