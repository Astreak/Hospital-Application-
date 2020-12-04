var express = require('express');
var db=require('./data.ts')
var app = express();


var redirectLogin = (req, res, next) => {
    if (req.session.prj)
        next()
    else
        res.redirect(303, '/login')
}
app.get('/msg', redirectLogin, (req, res, next) => {
    res.render('Msg')
})
app.post('/msg_post', (req, res, next) => {
    var tr = req.body.user
    db.findOne({ 'Email': req.session.prj })
        .then((d) => {
            d.Sent.push({
                user: tr,
                Open: true,
                Read: true,
                Text:req.body.msg
            })
            d.save()
            db.findOne({ 'Name': tr })
                .then((D) => {
                    D.Rec.push({
                        id: D.Rec.length+1,
                        user: d.Name,
                        Open: false,
                        Text: req.body.msg,
                        Hide:false
                    })
                    D.save()
                })
            res.redirect(303,'/msg')
        }).catch((E) => {
            console.log(E)
            next(E)
    })
})
app.get('/rec',redirectLogin, (req, res, next) => {
    db.findOne({ 'Email': req.session.prj })
        .then((d) => {
            res.render('Rec',{T:d.Rec,usr:req.session.chess})
        }).catch((e) => {
            console.log(e)
            next(e)
    })
   
})
app.get('/gg/:id', (req, res, next) => {
    db.findOne({ 'Email': req.session.prj })
        .then((d) => {
            
            var p = d.Rec.length
            for (let i = 0; i < p; i++){
                if (d.Rec[i].id == req.params.id) {
                    d.Rec[i].Open = true
                    d.save()
                    break
                }
            }
            res.redirect(303,'/msg')
        }).catch((e) => {
            console.log(e)
            next(e)
    })
})
//app.get('/sent', (req, res, next) => {
//    db.findOne({ 'Email': req.session.prj })
//        .then((d) => {
//            res.render('Rec', { T: d.Sent, usr: req.session.chess })
//        }).catch((e) => {
//            console.log(e)
//            next(e)
//        })
//
//})
app.get('/kk/:id', (req, res, next) => {
    var t = req.params.id
    db.findOne({ 'Email': req.session.prj })
        .then((d) => {
            var g = d.Rec.length;
            for (let i = 0; i < g; i++){
                if (t == d.Rec[i].id) {
                    d.Rec[i].Hide = true
                    d.save()
                    break
                }
            }
            res.redirect(303,'/rec')
        }).catch((e) => {
            console.log(e)
            next(e)
    })
})

module.exports=app