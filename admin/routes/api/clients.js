var express = require('express');
var router = express.Router();

const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

const requireJWT = require('../../middlewares/requireJWT');

// Retorna uma lista de cliente. Requer que o usuário esteja logado pelo uso do middleware requireJWT
router.get('/', [requireJWT], async (req, res) => {

  // obtem o JWT decodificado pelo middleware requireJWT e salvo em res.locals.jwt
  const jwt = res.locals.jwt;

  // verifica se não é um JWT de um employee e retorna um erro
  if (!jwt.employee) {
    return res.status(401).json({
      message: 'Não é um funcionário'
    });
  }

  // Obtém a lista de clientes da base de dados e retorna um JSON com ela.
  const clients = await knex.table('clients').select(['id', 'name', 'email']);
  res.json({
    clients
  });
});

module.exports = router;