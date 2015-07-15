var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/stream/:id', function(req, res, next) {
  var key = 'server-' + req.param('id');

  if (serverMap[key] == null) {
    return false;
  }

  port = serverMap[key].options.port;
  console.log("Streaming from port: " + port);

  res.render('stream', {port: port});
});

module.exports = router;
