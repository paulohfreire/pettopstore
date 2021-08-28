const knexConfig = require("../knexfile");

const knex = require('knex')(knexConfig);

module.exports = async (req, res, next) => {
  // verifica se a sessão está vazia (deslogado)
  if (! req.session || !req.session.logged_as) {
    return res.redirect('/auth/login_form');
  }
  // caso a sessão exista o usuário está logado.
  const idAdminLogado = req.session.logged_as;
  // buscar o administrador no banco de dados pelo id
  const client = await knex.table('clients').where({ id: idAdminLogado }).first();
  // coloca o employee (administrador) logado no res.locals  para que ele fique disponível
  // para outros requests de forma completa (todos os dados do banco)
  res.locals.client = client;
  next();// continua a requisição que inclui esse middleware

}