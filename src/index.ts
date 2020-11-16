var express = require('express');
var session = require('express-session')
const chat=require('./chat.ts')
var app = express();
app.use(chat)
app.use(session({
    name: 'admin',
    secret: process.env.PASS,
    saveUnInitialized: false,
    resave: false,
    cookie: {
        secret: false,
        httpOnly: false,
        maxAge: 60000000,
        path: '/'
    }
}));
app.use(session({
    name: 'bank',
    secret: process.env.PASS,
    saveUnInitialized: false,
    resave: false,
    cookie: {
        secret: false,
        httpOnly: false,
        maxAge: 60000000,
        path: '/'
    }
}));
var Logic = (req, res, next) => {
    req.session.admin = process.env.ADMIN
    next()
}
app.use(Logic)
app.get('/admin', (req, res) => {
    if (req.session.chess == req.session.admin)
        res.render('admin')
    else
        res.redirect(303,'/')
})

module.exports = app;
