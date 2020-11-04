var express = require('express');
var session = require('express-session')
var app = express();

app.use(session({
    name: 'admin',
    secret: '****?',
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
    req.session.admin = 'paraj'
    next()
}
app.use(Logic)
app.get('/admin', (req, res) => {
    if (req.session.prj == req.session.admin)
        res.render('admin')
    else
        res.redirect(303,'/')
})
module.exports = app;
