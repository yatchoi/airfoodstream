var express = require('express');
var router = express.Router();
var Store = require('../lib/store');

var store = new Store();

router.post('/:id/data', function(req, res) {
  var id = req.params.id;

  store.add(id, req.body);
  console.log(store.getLast(id));
  res.json({ status: 'ok' });
});

router.post('/:id/stream', function(req, res) {
  res.send('respond with a resource');
});

module.exports = router;
