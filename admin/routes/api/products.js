var express = require('express');
var router = express.Router();

const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

// Busca de produtos.
router.get('/search', async(req, res) => {

  // Obtem um query builder do knex da tabela products 
  let productsQuery = knex.table('products');

  // se o "term" de busca foi passado na query string da URL
  if (req.query.term) {

    // adiciona no query builder as restrições da busca por nome e descrição
    productsQuery = productsQuery
      .where('name', 'LIKE', `%${req.query.term}%`)
      .orWhere('description', 'LIKE', `%${req.query.term}%`);
  }

  // se for passado um category_id na query string da URL
  if (req.query.category_id) {

    // adiciona a restrição de buscar produtos somente por uma determinada categoria (category_id)
    // Exemplo; http://localhost:3000/api/products/search?category_id=7
    productsQuery = productsQuery
      .where('category_id', '=', req.query.category_id);
  }

  // Caso tenha sido passado o campo "order", muda a ordenação da busca (name ou price)
  // Exemplo: http://localhost:3000/api/products/search?order=price
  if (req.query.order) {
    if (req.query.order == 'name') {
      productsQuery = productsQuery.orderBy('name');
    } else if (req.query.order == 'price') {
      productsQuery = productsQuery.orderBy('price');
    }
  }

  // faz um left join de products com categories para poder retornar o nome da categoria do produto em uma consulta só.
  productsQuery = productsQuery.leftJoin('categories', 'products.category_id', 'categories.id');
  // informa que além dos campos de produtos, retornar também o nome da categoria dele como categoryName
  productsQuery = productsQuery.select('products.*', 'categories.name as categoryName')
  const products = await productsQuery;

  res.json({ products })
});

// Obtém um produto específico por ID
router.get('/:id', async (req, res) => {

  // busca um único produto, restrito por ID e com o nome da categoria no campo categoryName
  const product = await knex.table('products').where('products.id', '=', req.params.id)
  .leftJoin('categories', 'products.category_id', 'categories.id')
  .select('products.*', 'categories.name as categoryName')
  .first();
  return res.json({ product });
})

module.exports = router;