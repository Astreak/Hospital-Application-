var express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
const mongoose=require('mongoose')
const db = require("./data.ts");
const app2 = require('./index.ts')
var app = express();

var connect=mongoose.connect("mongodb://localhost:27017/Relationals", { useUnifiedTopology: true, useNewUrlParser: true })
connect .then(() => {
  console.log('Database Connected')
}).catch(() => {
    console.log('Check Database Connection')
})

app.use(session({
  name: 'prj',
  secret: '*****',
  saveUnInitialized: false,
  resave: false,
  cookie: {
    secret: false,
    maxAge: 6000000,
    path: '/',
    httpOnly: false,
    priority: 'High'
  }
}))
app.use(session({
  name: 'chess',
  secret: '*****',
  saveUnInitialized: false,
  resave: false,
  cookie: {
    secret: false,
    maxAge: 600000,
    path: '/',
    httpOnly: false,
    priority: 'High'
  }
}));
app.use(app2);

var redirectHome = (req, res, next) => {
  if (!req.session.prj)
    next()
  else
    res.redirect(303,'/')
}
var redirectLogin = (req, res, next) => {
  if (req.session.prj)
    next()
  else
    res.redirect(303,'/login')
}
var redirectRegister = (req, res, next) => {
  
}
var redirectionToLogin = (req, res, next) => {
  
}
app.get('/', redirectLogin, function (req, res) {
   
   res.render('layouts/main',{layout:false,user:req.session.prj});
});

app.get('/login',redirectHome, (req, res) => {
  res.render('login')
})
app.post('/login_post', (req, res,next) => {
  db.findOne({ 'Name': req.body.username, 'Password': req.body.password })
    .then((d) => {
      if (d) {
        req.session.prj = req.body.username
        req.session.chess = req.body.password
        console.log('Here')
        res.redirect(303, '/')
        
      }
      else {
            res.redirect(303,'/register')
      }
  })
    
})
app.get('/register', (req, res) => {
  console.log(req.session.chess)
  res.render('register')
})
app.get('/register/api', (req, res) => {
  console.log(req.session.chess)
  res.send("<h1> Stuff </h1>")
})
app.post('/register_post', (req, res,next) => {
  let email = req.body.email
  var temp;
  if (!req.body.hos)
    temp = false
  else
    temp=true
  db.findOne({ 'Email': email })
    .then((d) => {
      if (d != null) {
        res.redirect("/login")
        
      }
      else {
        return db.create({
          Name: req.body.username,
          hosstatus: temp,
          Email: req.body.email,
          Password: req.body.password,
          Bank:{Amount:req.body.Amount,Transaction:[]}
        })
      }
    }).then((d) => {
      console.log('User Created');
    }).catch((err) => {
      next(err)
    })
  res.redirect(303,'/')
})
app.get('/logout',redirectLogin, (req, res) => {
  req.session.destroy()
  res.clearCookie()
  res.redirect(303,'/')
})
module.exports = app;
