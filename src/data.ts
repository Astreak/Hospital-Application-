const mongoose = require('mongoose');

var Schema =mongoose.Schema;

var Store = new Schema({
    Name: {
        type: String,
        require: true,
        unique: false
    },
    Email: {
        type: String,
        require: true,
        unique: true
    },
    Password: {
        type: String,
        require: true,
        unique: false
    }
},
    {
        timestamp:true
    })

var Store = mongoose.model('Chess', Store)
module.exports = Store;
