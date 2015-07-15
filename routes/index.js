var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/stream', function(req, res, next) {
  res.render('stream');
});

module.exports = router;
