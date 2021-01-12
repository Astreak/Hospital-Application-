const express = require('express');
const db = require('./data.ts');
const session = require('express-session');
app = express();
// app.use(session({
//         name: 'NSA',
//         secret: process.env.PASS,
//         saveUnInitialized: false,
//         resave: false,
//         cookie: {
//                 secret: false,
//                 maxAge: 6000000,
//                 path: '/',
//                 httpOnly: true,
//                 priority: 'High',
//                 ephemeral: true
//         }
// }));
var loginR = (req, res, next) => {
        if (!req.session.prj) {
                res.redirect('/login');
        }
        else
                next();
}
app.get("/api/users/:name", loginR,(req, res, next) => {
        var name = req.params.name;
        db.findOne({ "Name": name })
                .then((d) => {
                        res.json(d);
        })
})
module.exports = app;