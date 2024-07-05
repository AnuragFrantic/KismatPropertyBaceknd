const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    name: String,
    phone: String,
    email: String,
    area: String,

}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema);