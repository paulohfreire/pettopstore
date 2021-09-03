const jwt = require('jsonwebtoken');
const segredoJWT = 'frase segredo para critografia do jwt';

module.exports = async (req, res, next) => {
  // verifica se a sessão está vazia (deslogado)
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: 'Não autorizado'
    });
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedJWT = jwt.verify(token, segredoJWT);
    res.locals.jwt = decodedJWT;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido'
    });
  }
}