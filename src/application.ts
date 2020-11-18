const express = require('express');
const db = require('./data.ts');
const session = require('express-session');

app = express();

//Patient Logic

app.get('/pat/:name', (req, res, next) => {
        res.render('Pat',{usr:req.session.chess,pat:req.params.name})        
})

module.exports=app