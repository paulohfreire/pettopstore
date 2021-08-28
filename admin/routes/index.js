var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Exemplo Aula',
    client: res.locals.client 
});
});

module.exports = router;
