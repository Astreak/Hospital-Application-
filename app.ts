var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var usersRouter = require('./src/users.ts');
const handlebars = require('express3-handlebars').create({
  defaultLayout: 'layout',
  'helpers': [
    {
      'if_equal': (a, b) => {
        if (a == b)
          return "OK"
        else
          return "No Auth"
      }
    }
  ]
})
var app = express();


app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', usersRouter);


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
