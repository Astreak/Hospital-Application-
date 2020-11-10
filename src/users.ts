var express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
const mongoose=require('mongoose')
const db = require("./data.ts");
const app2 = require('./index.ts')
var app = express();

//Connecting Database
var connect=mongoose.connect("mongodb://localhost:27017/Health", { useUnifiedTopology: true, useNewUrlParser: true })
connect .then(() => {
  console.log('Database Connected')
}).catch(() => {
    console.log('Check Database Connection')
})

//Sessions
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
  name: 'status',
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


//Middlewares
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
  //pass
}
var redirectionToLogin = (req, res, next) => {
  //pass
}
app.get('/', redirectLogin, function (req, res) {
   
   res.render('layouts/main',{layout:false,user:req.session.chess,status:req.session.status});
});


//Login Logic
app.get('/login',redirectHome, (req, res) => {
  res.render('login')
})
app.post('/login_post', (req, res, next) => {
  let temp
  db.findOne({ 'Name': req.body.username, 'Password': req.body.password })
    .then((d) => {
      if (d) {
        req.session.prj = d.Email
        req.session.chess = req.body.username
        console.log('Here')
        req.session.status=d.hosstatus
        res.redirect(303, '/')

        
      }
      else {
            res.redirect(303,'/register')
      }
  })
    
})



//Register Logic
app.get('/register', (req, res) => {
 res.render('register')
})
app.get('/register/api', (req, res) => {
  console.log(req.session.chess)
  res.send("<h1> Stuff </h1>")
})
app.post('/register_post', (req, res, next) => {
  var temp = req.body.hos ? true : false
  console.log(temp)
   db.findOne({ 'Email': req.body.email })
    .then((d) => {
      if (d != null) {
        res.redirect(303,"/login")
        
      }
      else {
        if (temp) {
          return db.create({
            Name: req.body.username,
            hosstatus: temp,
            Tasks:[],
            Email: req.body.email,
            Password: req.body.password,
            Bank: {
              Amount: req.body.Amount,
              Transaction: []
            }
          })
        }
        else {
          return db.create({
            Name: req.body.username,
            hosstatus: temp,
            Email: req.body.email,
            Password: req.body.password,
            Bank: {
              Amount: req.body.Amount,
              Transaction: []
            }
          })
        }
      }
    }).then((d) => {
      console.log('Registered')
      res.redirect(303, '/')
    }).catch((g) => {
      console.log(g)
      console.log('Error')
     var e=new Error('Not Registered')
      next(e)
    })
    
})

//Medic Stuff
app.get('/treatment',redirectLogin, (req, res, next) => {
    res.render('Treat',{user:req.session.chess})
})
app.post('/treat_post', (req, res, next) => {
  db.findOne({ 'Name': req.body.Doctor, 'hosstatus': true })
    .then((d) =>{
      d.Tasks.push({
        user: req.session.prj,
        status: true,
        Cost:60
      })
      d.save()
      console.log('Successfully recorded')
      res.redirect(303,'/')
    }).catch((e) => {
      console.log(e)
      next(e)
  })
})




// Bank Stuffs
app.get('/bank', redirectLogin, (req, res, next) => {
  let g
  db.findOne({ 'Email': req.session.prj })
    .then((d) => {
      console.log('ok')
      g = d.Bank.Amount;
      g = g.toFixed(30).toString()
      res.render('Bank', { am: g })
    }).catch((e) => {
      console.log(e)
      next(e)
    })
  
})


//Logout
app.get('/logout',redirectLogin, (req, res) => {
  req.session.destroy()
  res.clearCookie()
  res.redirect(303,'/')
})
module.exports = app;
