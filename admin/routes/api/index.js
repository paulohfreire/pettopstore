const express = require('express');
const authRouter = require('./auth');
const clientsRouter = require('./clients');
const productsRouter = require('./products');
const salesRouter = require('./sales');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/clients', clientsRouter);
router.use('/products', productsRouter);
router.use('/sales', salesRouter);

module.exports = router;