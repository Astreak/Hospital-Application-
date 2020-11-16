var express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
const mongoose=require('mongoose')
const db = require("./data.ts");
const app2 = require('./index.ts')
var app = express();

//Connecting Database
var connect=mongoose.connect(process.env.CONNEC, { useUnifiedTopology: true, useNewUrlParser: true })
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
app.use(session({
  name: 'array',
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
var redirectTask = (req, res, next) => {
  let name = req.session.prj
  db.findOne({ 'Email': name })
    .then((d) => {
      if (d.hosstatus)
        next()
      else
        res.redirect(303,'/')
    }).catch((e) => {
      console.log(e)
      res.redirect('/')
    })
}
var redirectTreat = (req, res, next) => {
  let t = req.session.prj
  db.findOne({ 'Email': t })
    .then((d) => {
      if (!d.hosstatus)
        next()
      else
        res.sendStatus(500)
    }).catch((e) => {
      console.log(e)
      next(e)
  })
}
app.get('/', redirectLogin, function (req, res) {
   console.log(process.env.NAME)
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
        res.redirect(303, "/login")
        
      }
      else {
        if (temp) {
          return db.create({
            Name: req.body.username,
            hosstatus: temp,
            Tasks: [],
            Email: req.body.email,
            Password: req.body.password,
            Sent: [],
            Rec:[],
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
            Sent: [],
            Rec:[],
            Bank: {
              Amount: req.body.Amount,
              Transaction: []
            }
          })
        }
       
      }
    }).then((d) => {
      console.log('Registered')
      res.redirect(303,'/')
      
    }).catch((g) => {
      console.log(g)
      console.log('Error')
     var e=new Error('Not Registered')
      next(e)
    })
    
})

//Medic Stuff
app.get('/treatment',[redirectLogin,redirectTreat], (req, res, next) => {
    res.render('Treat',{user:req.session.chess})
})
app.post('/treat_post', (req, res, next) => {
  db.findOne({ 'Name': req.body.Doctor, 'hosstatus': true })
    .then((d) =>{
      d.Tasks.push({
        user: req.session.chess,
        task:req.body.problem,
        status: true,
        active:false,
        Cost:0
      })
      d.save()
      console.log('Successfully recorded')
      res.redirect(303,'/treatment')
    }).catch((e) => {
      console.log(e)
      next(e)
  })
})



//finishing tasks
app.get('/finish/:name', (req, res, next) => {
  let temp;
  db.findOne({ 'Name': req.session.chess })
    .then((d) => {
      let k = d.Tasks.length
      for (let i = 0; i < k; i++){
        if (d.Tasks[i].user == req.params.name && d.Tasks[i].status == true && d.Tasks[i].active==true) {
          console.log(d.Tasks[i].status)
          d.Tasks[i].status = false
          d.Tasks[i].active=false
          d.save()
          temp = d.Tasks[i].Cost
          d.Bank.Amount += temp
          d.Bank.Transaction.push({ user: req.params.name, credit: `+${temp}`,stat:true})
          d.save()
          break;
        }
      }
      req.session.array=d.Bank.Transaction
      
      db.findOne({ 'Name': req.params.name })
        .then((d) => {
          console.log('ok')
          if (d.Bank.Amount >= 60) {
            d.Bank.Amount -= temp
            d.Bank.Transaction.push({ user: req.session.chess, credit: `-${temp}`,stat:false})
            d.save()
            res.redirect(303,'/bank')
          }
          else
              next('not found')
        }).catch((e) => {
          next(e)
      })
    }).catch((e) => {
      console.log(e)
      next(e)
  })
})


//tasks
app.get('/tasks',redirectTask, (req, res, next) => {
  db.findOne({'Email': req.session.prj })
    .then((d) => {
      res.render('Task',{Task:d.Tasks})
    }).catch((e) => {
      console.log(e)
      next(e)
  })
})

// assigning value

app.get('/assign/:name', redirectLogin, (req, res, next) => {
  res.render('A', { usr: req.params.name })

})
app.post('/assign_post/:name', redirectLogin, (req, res, next) => {
  console.log(req.params.name)
  let v = parseInt(req.body.cost)
  console.log(v)
  db.findOne({ 'Email': req.session.prj })
    .then((d) => {
      var g = d.Tasks.length;
      console.log(g)
      for (let i = 0; i < g; i++) {
        if (req.params.name == d.Tasks[i].user && d.Tasks[i].active == false) {
          d.Tasks[i].active = true
          console.log('Inside loop')
          d.Tasks[i].Cost = v
          d.save()
          break;
        }
      }
      res.redirect(303, '/tasks')
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
      
      res.render('Bank', { am: g,T:d.Bank.Transaction })
    }).catch((e) => {
      console.log(e)
      next(e)
    })
  
})

app.get('/api/:name', (req, res, next) => {
  if (req.session.admin == req.session.chess) {
    db.findOne({ 'Name': req.params.name })
      .then((d) => {
        d.Rec[0].id = 1;
        d.Rec[1].id = 2;
        d.Rec[2].id = 3
        d.save()
        res.json(d)

      }).catch((e) => {
        console.log(e)
        next(e)
      })
  }
  else {
    res.sendStatus(403)
  }
})


//Logout
app.get('/logout',redirectLogin, (req, res) => {
  req.session.destroy()
  res.clearCookie()
  res.redirect(303,'/')
})
module.exports = app;
