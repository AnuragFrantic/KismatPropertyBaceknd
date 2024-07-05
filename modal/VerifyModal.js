const mongoose = require('mongoose')

const verifyMobile = new mongoose.Schema({
    phone: String,
    otp: String
}, { timestamps: true })


module.exports = mongoose.model('VerifyMobile', verifyMobile);