const express = require('express');
const router = express.Router();
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);

router.get('/report', async(req, res) => {
  // obtem todas as vendas do banco de dados
  const sales = await knex.table('sales');

  // para cada venda obtida
  for (const sale of sales) {
    // adiciona os items da venda no objeto
    sale.items = await knex.table('items').where('sale_id', '=', sale.id);
    if (sale.employee_id !== null) {
      // caso existe um funcionário, buscar ele do banco e adiciona no objeto
      sale.employee = await knex.table('employees').where('id', '=', sale.employee_id).first();
    }
    if (sale.client_id !== null) {
      // caso existe um cliente, buscar ele do banco e adiciona no objeto
      sale.client = await knex.table('clients').where('id', '=', sale.client_id).first();
    }

    for (const item of sale.items) {
      // para cada item da venda adicionar no item o produto que ele se referencia
      item.product = await knex.table('products').where('id', '=', item.product_id).first();
    }
  }

  // renderizar o relatório de vendas passando a lista de vendas (sales)
  res.render('sales/report', { sales });
});

module.exports = router;