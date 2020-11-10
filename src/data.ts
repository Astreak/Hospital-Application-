const  mongoose = require('mongoose');

var Schema = mongoose.Schema;


var Store = new Schema({
    Name: {
        type: String,
        require: true,
        unique: false
    },
    hosstatus: {
        type: Boolean,
        require: true,
        unique:false
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
    },
    Tasks: {
        type: [{
            user: String,
            status: Boolean,
            Cost:Number
        }],
        require: false,
        unique:false
    },
    Bank: {
        Amount: {
            type: Number,
            require: true,
            unique:false
        },
        Transaction: {
            type: [{
                user: String,
                credit: Number
            }],
            require: false,
            unique: false
        }
        
    }
},
    {
        timestamp:true
    })

var Store = mongoose.model('Hospital', Store)
module.exports = Store;
