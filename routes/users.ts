var express = require('express');
var router = express.Router();
var app = express();

router.get('/users', function(req, res, next) {
  res.render('Users')
});
router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login_post', (req, res) => {
  console.log(req.body.username);
  res.redirect(303, '/');
})
module.exports = router;
