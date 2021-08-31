var express = require('express');
var router = express.Router();

const requireJWT = require('../../middlewares/requireJWT');

const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

// Obtém uma venda (sale) através de seu id.
router.get('/:sale_id', [requireJWT], async (req, res) => {

  // obtem o token JWT decodificado pelo middleware requireJWT
  const jwt = res.locals.jwt;

  // Só permite que funcionários(employee) usem essa rota
  if (!jwt.employee) {
    return res.status(401).json({
      message: 'Não é funcionário'
    });
  }

  // Busca uma venda (sale) através do ID passado.
  const sale = await knex.table('sales').where('sales.id', '=', req.params.sale_id).first();
  // busca todos os items da venda encontrada
  sale.items = await knex.table('items').where('sale_id', '=', sale.id);

  // para cada item da venda, buscar o produto desse item
  for (const item of sale.items) {
    item.product = await knex.table('products').where('id', '=', item.product_id).first();
  }

  //retorna os dados da venda, já com os itens e produtos
  res.json({ sale });
});

// cria uma nova venda.
// pode ser chamado por um funcionaŕio no PDV ou por um client ena loja online
router.post('/', [requireJWT], async (req, res) => {

  // obtem o token JWT decodificado pelo middleware requireJWT
  const jwt = res.locals.jwt;
  let sale = {};

  // Uma venda pode ser criada por um funcionário ou um cliente. O token JWT tem a informação se ele é de um client ou employee
  // caso seja por um funcionário:
  if (jwt.employee) {
    // então a venda a ser criada recebe o id do cliente escolhido no PDV, além do id do funcionário (employee) que está criando a venda
    sale.client_id = req.body.client_id;
    sale.employee_id = jwt.employee.id;
  } else if (jwt.client) {
    // caso seja um cliente, veio da loja on-line, então não existe funcionário envolvido.
    // nesse caso o id do cliente é o id que está no token JWT dele, já que ele mesmo criou a venda para ele mesmo pela loja (fez uma compra).
    sale.client_id = jwt.client.id;

    // e o ID do employee deve ser nulo, pois não existe funcionário envolvido no processo.
    sale.employee_id = null;
  } else {
    return res.status(401).json({
      message: 'Não é cliente nem funcionário'
    })
  }

  // insere e venda no banco
  const result = await knex.table('sales').insert(sale);

  // o id da venda inserida é o primeiro item do result (array), de acordo com o padrão do knex
  sale.id = result[0];

  // Com a venda já inserido podemos agora inserir no banco os items na venda criada 
  const items = [];
  // é passado um array de produtos que são os itens da venda no PDV ou compra no site on-line
  // para cada um desses productIDs, criar noco elemento no array items com o ID da venda e o ID do produto.
  for (const productID of req.body.productIDs) {
    items.push({
      sale_id: sale.id,
      product_id: productID
    });
  }

  // Inserir todos os itens do array no banco de dados
  await knex.table('items').insert(items);

  // retornar a venda criada como JSON
  res.json({ sale });
});

module.exports = router;