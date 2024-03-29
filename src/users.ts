var express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
const mongoose=require('mongoose')
const db = require("./data.ts");
const app2 = require('./index.ts')
const auth=require('./Auth')
const bcrypt = require('bcryptjs')
const fileStore=require('session-file-store')(session)
const byc = require('bcrypt');
var app = express();

// const { Client } = require('pg');
// var client = new Client({
//   user: 'postgres',
//   password: process.env.past,
//   database: 'random',
//   host: 'localhost',
//   port:5432
// })
// client.connect()
//   .then(() => console.log('psql connected'))
//   .catch((e)=>console.log(e))

//Connecting Database
var connect = mongoose.connect(process.env.CONNEC, { useUnifiedTopology: true, useNewUrlParser: true })
connect .then(() => {
    console.log('Database Connected')
}).catch(() => {
    
})

//Sessions
app.use(session({
  name: 'prj',
  secret: '*****',
  saveUnInitialized: false,
  resave: false,
  cookie: {
    secret: false,
    maxAge: 6000000000,
    path: '/',
    httpOnly: true,
    priority: 'High',
    ephemeral: true,
    store:new fileStore()

  }
}))
app.use(session({
  name: 'status',
  secret: process.env.PASS,
  saveUnInitialized: false,
  resave: false,
  cookie: {
    secret: false,
    maxAge: 6000000000,
    path: '/',
    httpOnly: true,
    priority: 'High',
    ephemeral:true
  }
}))
app.use(session({
  name: 'chess',
  secret: process.env.PASS,
  saveUnInitialized: false,
  resave: false,
  cookie: {
    secret: false,
    maxAge: 600000000,
    path: '/',
    httpOnly: false,
    priority: 'High',
    ephemeral:true
  }
}));
app.use(session({
  name: 'array',
  secret: process.env.PASS,
  saveUnInitialized: false,
  resave: false,
  cookie: {
    secret: false,
    maxAge: 600000000,
    path: '/',
    httpOnly: false,
    priority: 'High',
    epehmeral:true
  }
}));
app.use(session({
  name: 'anny',
  secret: process.env.PASS,
  saveUnInitialized: false,
  resave: false,
  cookie: {
    secret: false,
    maxAge: 600000000,
    path: '/',
    httpOnly: false,
    priority: 'High',
    epehmeral: true
  }
}));
app.use(session({
  name: 'profile',
  secret: process.env.PASS,
  saveUnInitialized: false,
  resave: false,
  cookie: {
    secret: false,
    maxAge: 600000000,
    path: '/',
    httpOnly: false,
    priority: 'High',
    epehmeral: true
  }
}));
//Middlewares
app.use(auth);
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
      //console.log(e)
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
      //console.log(e)
      next(e)
  })
}
app.get('/', redirectLogin, function (req, res) {
  //console.log(process.env.NAME)
  //console.log(req.session)
   res.render('layouts/main',{layout:false,user:req.session.chess,status:req.session.status});
});


//Login Logic
app.get('/login',redirectHome, (req, res) => {
  res.render('login')
})
app.post('/login_post', async(req, res, next) => {
  
  db.findOne({ 'Email': req.body.Email})
    .then((d) => {
      
      if (d) {
        if (byc.compareSync(req.body.password, d.Password)) {
          req.session.prj = d.Email
          req.session.chess = d.Name
          //console.log('Here')
          req.session.status = d.hosstatus
          res.redirect(303, '/')
        }
        else {
          res.redirect(303,'/login')
        }
        
      }
      else {
            res.redirect(303,'/register')
      }
  })
    
})
// Seeing medical  data

app.get('/medical',async(req,res,next)=>{
    db.findOne({'Email':req.session.prj})
    .then((d)=>{
        if(d.hosstatus){
          var temp=d.Tasks.filter((i)=>{
              return (i.active && i.status)
          })
          res.render('Medical',{P:temp})
        }
        else
            res.sendStatus(500)
    }).catch((e)=>{
      console.log(e)
      next(e)
    })
})




//Register Logic
app.get('/register', (req, res,next) => {
 res.render('register')
})
app.get('/register/api', (req, res,next) => {
  //console.log(req.session.chess)
  res.send("<h1> Stuff </h1>")
})
app.post('/register_post',async(req, res, next) => {
  var temp = req.body.hos ? true : false
  var hashed = await byc.hash(req.body.password, 10);
  var g = req.body.username + req.body.email + req.body.password + `${process.env.salt} ${req.body.username}and${req.body.email}`
  var api_key = await byc.hash(g, 12);
  //console.log(temp)
  
    db.findOne({ 'Email': req.body.email })
      .then((d) => {
        if (d != null) {
          res.redirect(303, "/login")
        
        }
        else {
          if (temp) {
            return db.create({
              APIKEY: api_key,
              Name: req.body.username,
              Profile: {
                Name: req.body.username,
                Description: '',
                Exp: ''
              },
              hosstatus: temp,
              Follower: [],
              Followed:[],
              Tasks: [],
              Email: req.body.email,
              Password:hashed,
              Sent: [],
              Rec: [],
              Bank: {
                Amount: req.body.Amount,
                Transaction: []
              }
            })
          
          }
          else {
            return db.create({
              APIKEY: api_key,
              Name: req.body.username,
              Profile: {
                Name: req.body.username,
                Description: '',
                Exp: ''
              },
              hosstatus: temp,
              Health:{
                BMR:'',
                HeartPulse:NaN,
                Severity:NaN,
                OverAll:''
              },
              Email: req.body.email,
              Password: hashed,
              Sent: [],
              Rec: [],
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
        var e = new Error('Not Registered')
        next(e)
      })
  
    
})
app.get('/search', async (req, res, next) => {
  res.render('Search');
})
app.post('/search_name', async(req, res, next) => {
  var user = req.body.search
  console.log(user)
  var E = [];
  db.find({ 'Name': user }, (err, u) => {
    if (err) throw err;
    res.render('Users',{U:u})
  })
    
})
app.get('/manage/:id', async (req, res, next) => {
  db.findOne({ '_id': req.params.id })
    .then((d) => {
      req.session.profile = d.Profile
      res.redirect(303,'/manage')
    }).catch((e) => {
      console.log(e)
      next(e)
  })
    
})
app.get('/manage', async (req, res, next )=>{
    res.render('Manage',{O:req.session.profile})
})

app.get('/doc', async (req, res, next) => {
  db.find({ 'hosstatus': true }, (e, u) => {
    if (e) throw e;
    res.render('Users',{U:u})
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
        Cost: 0,
        hide:false
      })
      d.save()
      db.findOne({ 'Email': req.session.prj })
        .then((D) => {
          D.Treat.push({
            user: d.Name,
            Aid: req.body.problem,
            Acc1: false,
            Acc2: false,
            Start:true,
            Comp: false,
            Details:[]
          })
          D.save()
      })
      //console.log('Successfully recorded')
      res.redirect(303,'/treatment')
    }).catch((e) => {
      //console.log(e)
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
          //console.log(d.Tasks[i].status)
          d.Tasks[i].status = false
          d.Tasks[i].active = false
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
          //console.log('ok')
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
      //console.log(e)
      next(e)
  })
})

//tasks
app.get('/tasks',redirectTask, (req, res, next) => {
  db.findOne({'Email': req.session.prj })
    .then((d) => {
      res.render('Task',{Task:d.Tasks})
    }).catch((e) => {
      //console.log(e)
      next(e)
  })
})

// assigning value

app.get('/assign/:name', redirectLogin, (req, res, next) => {
  req.session.status=req.params.name
  res.redirect(303,'/assign')

})
app.get('/assign', (req, res, next) => {
    //console.log(req.session.status)
    res.render('Ann', { usr: req.session.status})
})
app.post('/assign_post/:name', redirectLogin, (req, res, next) => {
  //console.log(req.params.name)
  let v = parseInt(req.body.cost)
  //console.log(v)
  db.findOne({ 'Email': req.session.prj })
    .then((d) => {
      var g = d.Tasks.length;
      //console.log(g)
      for (let i = 0; i < g; i++) {
        if (req.params.name == d.Tasks[i].user && d.Tasks[i].active == false) {
          d.Tasks[i].active = true
          //console.log('Inside loop')
          d.Tasks[i].Cost = v
          d.save()
          break;
        }
      }
      res.redirect(303, '/tasks')
    }).catch((e) => {
      //console.log(e)
      next(e)
    })
})

app.get('/del/:name', redirectLogin, (req, res, next) => {
  db.findOne({ 'Email': req.session.prj})
    .then((d) => {
      let r = d.Tasks.length;
      for (let i = 0; i < r; i++){
        if (d.Tasks[i].user = req.params.name && d.Tasks[i].status == true) {
          d.Tasks[i].status = false;
          d.save()
          break
        }
      }
      res.redirect(303,'/tasks')
    }).catch((e) => {
      //console.log(e)
      next(e)
  })

})
app.get('/hide/:name', (req, res, next) => {
  let n = req.params.name;
  db.findOne({ 'Email': req.session.prj })
    .then((d) => {
      let r = d.Tasks.length;
      for (let i = 0; i < r; i++){
        if (d.Tasks[i].user == n && d.Tasks[i].status == false && d.Tasks[i].hide == false) {
          d.Tasks[i].hide = true
          d.save()
        }
      }
      res.redirect(303,'/tasks')
    }).catch((e) => {
      //console.log(e)
      res.redirect('error')
  })
})



// Bank Stuffs
app.get('/bank', redirectLogin, (req, res, next) => {
  let g
  db.findOne({ 'Email': req.session.prj })
    .then((d) => {
      //console.log('ok')
      g = d.Bank.Amount;
      g = g.toFixed(10).toString()
      
      res.render('Bank', { am: g,T:d.Bank.Transaction })
    }).catch((e) => {
      //console.log(e)
      next(e)
    })
  
})

app.get('/api/:name',redirectLogin, (req, res, next) => {
  if (req.session.admin == req.session.chess) {
    db.findOne({ 'Name': req.params.name })
      .then((d) => {
        // d.Rec[0].id = 1;
        // d.Rec[1].id = 2;
        // d.Rec[2].id = 3
        d.save()
        res.json(d)

      }).catch((e) => {
        //console.log(e)
        next(e)
      })
  }
  else {
    res.sendStatus(403)
  }
})
app.get('/profile', redirectLogin, (req, res, next) => {
  db.findOne({ 'Email': req.session.prj })
    .then((d) => {
      res.render('profile', { usr: d })
  })
        
    
})
app.post('/profile_update', redirectLogin, (req, res, next) => {
  var temp = req.body;
  db.findOne({ 'Email': req.session.prj })
    .then((d) => {
      d.Profile.Name = temp.name
      d.Profile.Description = temp.des
      d.Profile.Exp=temp.exp
      d.save();
      res.redirect(303,'/show')
    }).catch((e) => {
      console.log(e);
      
    })
})
app.get('/nearest', redirectLogin, (req, res, next) => {
    res.render('Maps',{api:process.env.APIK})
})
app.get('/show', redirectLogin, (req, res, next) => {
  db.findOne({ 'Email': req.session.prj })
    .then((d) => {
      var T = d.Profile;
      res.render('Show',{Info:T,usr:d})
    }).catch((e) => {
    console.log(e)
  })
})



//Logout
app.get('/logout',redirectLogin, (req, res) => {
  req.session.destroy()
  res.clearCookie()
  res.redirect(303,'/')
})
module.exports = app;
