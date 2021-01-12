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
app.get("/api/users/:name",(req, res, next) => {
        var name = req.params.name;
        var t = req.query.api_key;
        if (t) {
                db.findOne({ "APIKEY": t })
                        .then((d) => {
                                if (d != null) {
                                        var temp=d.Name
                                        db.findOne({ "Name": name })
                                                .then((D) => {
                                                        var T = D;
                                                        T["APIKEY"] = "HIDDEN"
                                                        T["_id"] = "HIDDEN"
                                                        T["PASSWORD"] = "HIDDEN";
                                                        res.json({ 'Fetcher': temp, 'Data': T });
                                                }).catch((e) => {
                                                        console.log(e);
                                                        res.sendStatus(404)
                                                })
                                }
                                else {
                                        res.json(403);
                                }
                        }).catch((e) => {
                                console.log("ERROR FROM KEY" + e);
                                res.sendStatus(404);
                        })
        }
        else
                res.sendStatus(403);
})
module.exports = app;