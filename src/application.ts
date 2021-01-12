const express = require('express');
const db = require('./data.ts');
const session = require('express-session');
const apis = require('./apis.ts')
var app = express();
app.use(session({
        name: 'Hond',
        secret: process.env.PASS,
        saveUnInitialized: false,
        resave: false,
        cookie: {
                secret: false,
                maxAge: 6000000,
                path: '/',
                httpOnly: true,
                priority: 'High',
                ephemeral: true
        }
}));
app.use(apis);
//Patient Logic

app.get('/pat/:name', (req, res, next) => {
        req.session.Hond=req.params.name
        res.redirect(303,'/pat')     
})
app.get('/pat', (req, res, next) => {
        res.render('Pat',{pat:req.session.Hond,usr:req.session.chess})
})

module.exports=app