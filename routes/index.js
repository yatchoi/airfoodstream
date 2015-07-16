var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/stream/:id', function(req, res, next) {
  var id = req.params.id;
  var key = 'server-' + id;

  if (serverMap[key] == null) {
    return res.send(404);
  }

  port = serverMap[key].options.port;
  console.log("Streaming from port: " + port);

  res.render('stream', { port: port, data: store.getLast(id) });
});

module.exports = router;
