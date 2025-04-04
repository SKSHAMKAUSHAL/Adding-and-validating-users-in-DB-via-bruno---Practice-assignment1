const mongoose = require('mongoose');

const data = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    mail:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
})

module.exports = mongoose.model("User", data);