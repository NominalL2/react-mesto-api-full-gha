const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const { JWT_SECRET } = require('../constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    if (!token) {
      return next(new AuthorizationError('Необходима авторизация'));
    }
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
