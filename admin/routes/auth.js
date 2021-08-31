// importa a configuração do knex do knexfile.js
var knexConfig = require('../knexfile');
// importa o knex aplicando a configuração
var knex = require('knex')(knexConfig);
var bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();

// exibe o formulário de login
router.get('/login_form', async (req, res) => {
  // renderiza formulário EJS (view)
  res.render('auth/login_form', { error: req.query.error });
});

// tenta logar o employee e redirecionar para a raiz do sistema
router.post('/sign_in', async (req, res) => {
  // busca employee no banco com esse email
  const employee = await knex.table('employees').where({ email: req.body.email, is_admin: true }).first();
  if (!employee) {
    return res.redirect('/auth/login_form?error=1');
  }
  // compara a senha passada pelo formulário com a senha critografa no banco de dados
  if ( bcrypt.compareSync(req.body.password, employee.password) ) {
    // se senha é correta, guarda o ID do employee na sessão
    // permitindo que seja utilizado em outras rotas
    req.session.logged_as = employee.id;
    // redireciona usuário para a raiz do sistema
    return res.redirect('/');
  } else {
    // caso a senha seja incorreta limpa sessão do cookie-session
    req.session = null;

    // redireciona usuário para o formulário de login novamente, com um parâmetro de erro=1
    return res.redirect('/auth/login_form?error=1');
  }
});

// desloga o employee e redireciona para o form de login
router.get('/sign_out', async (req, res) => {
  req.session = null;
  return res.redirect('/auth/login_form');

});

module.exports = router;