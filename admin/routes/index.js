var express = require('express');
var router = express.Router();
var productsRouter = require('./products');
var salesRouter = require('./sales');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Pet Top Store',
    employee: res.locals.employee 
});
});

router.use('/products', productsRouter);
router.use('/sales', salesRouter);


module.exports = router;
