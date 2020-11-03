var express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
var app = express();
app.use(session({
  name: 'prj',
  secret: '*****',
  saveUnInitialized: false,
  resave: false,
  cookie: {
    secret: false,
    maxAge: 6000000,
    path: '/',
    httpOnly: true,
    priority: 'Low'
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
    priority:'High'
  }
}))
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
app.get('/', redirectLogin, function (req, res) {
   console.log(req.session.cookie.domain)
   res.render('index');
});

app.get('/login',redirectHome, (req, res) => {
  res.render('login')
})
app.post('/login_post', (req, res) => {
  req.session.prj = req.body.username
  req.session.chess = req.body.password
  console.log(req.session.chess)
  
 
  res.redirect(303,'/')
})
app.get('/register', (req, res) => {
  console.log(req.session.chess)
  res.render('register')
})
app.get('/register/api', (req, res) => {
  console.log(req.session.chess)
  res.send("<h1> Stuff </h1>")
})
app.post('/register_post', (req, res) => {
  console.log('Data successfully recorded')
  res.redirect(303,'/')
})
app.get('/logout',redirectLogin, (req, res) => {
  req.session.destroy()
  res.clearCookie()
  res.redirect(303,'/')
})
module.exports = app;
