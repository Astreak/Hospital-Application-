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
            task:String,
            status: Boolean,
            active:Boolean,
            Cost:Number
        }],
        require: false,
        unique:false
    },
    Sent: {
        type: [{
            user: String,
            Open: Boolean,
            Text:String,
        }],
        require: false,
        unique:false
    },
    Rec: {
        type: [{
            id: {
                type: Number,
                default:0
            },
            user: String,
            Open: Boolean,
            Text: String,
            Hide:Boolean
        }],
        require: false,
        unique: false
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
                credit: String,
                stat:Boolean
            }],
            require: false,
            unique: false
        }
        
    }
},
    {
        timestamp:true
    })

var Store = mongoose.model('ml', Store)
module.exports = Store;
