var express = require('express');
var router = express.Router();
var app = express();

router.get('/users', function(req, res, next) {
  res.render('Users')
});

module.exports = router;
