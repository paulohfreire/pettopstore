const express = require('express');
const router = express.Router();

const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);

const multer  = require('multer');

const upload = multer({ dest: './public/images' });

router.get('/', async (req, res) => {
  const products = await knex.table('products').select();
  for (const product of products) {

    product.category = await knex.table('categories').where('id', '=', product.category_id).first()
    console.log(product.category);
  }
  res.render('products/list', { products });
});

router.get('/new', async (req, res) => {
  const categories = await knex.table('categories').select();
  res.render('products/new', { categories });
});

router.post('/create', upload.single('photo'), async (req, res) => {
  await knex.table('products').insert({
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    photo: req.file.filename,
    category_id: req.body.category_id
  });
  res.redirect('/products');

});

module.exports = router;