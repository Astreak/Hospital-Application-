const express = require('express');
const db = require('./data.ts');
const request = require('request');
const session = require('express-session');
var app=express();
app.get('/clinical', (req, res, next) => {
        res.render('HomePage')
})
app.get('/dashBoard', (req, res, next) => {
        res.render('Dashboard',{usr:req.session.chess})
})
app.get('/getClinicalData', async (req, res, next) => {
        res.render('ClinicalData',{usr:req.session.chess})
})
app.post('/clinical_update', (req, res, next) => {
        console.log(req.session.prj)
        db.findOne({ 'Email': req.session.prj })
                .then((d) => {
                        console.log(d.Health)
                        d.Health={
                                BMR: req.body.bmr,
                                HeartPulse: parseInt(req.body.hpr),
                                Severity: parseInt(req.body.sev),
                                OverAll:req.body.overall
                        }
                        d.save()
                res.redirect(303,'/dashBoard')
                }).catch((e) => {
                        console.log(e)
                next(e)
        })
})
module.exports = app;