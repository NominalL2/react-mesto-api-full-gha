require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const NotFoundError = require('./errors/NotFoundError');
const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { linkPattern, MONGO_DB } = require('./constants');

const validationUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkPattern),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const router = express.Router();

const { PORT = '3000' } = process.env;

const app = express();

app.use(express.json());

mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', validationUser, createUser);

app.use('/users', auth, require('./routes/users'));

app.use('/cards', auth, require('./routes/cards'));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(auth, router.use('*', (req, res, next) => {
  next(new NotFoundError('Not Found'));
}));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .json({
      message: statusCode === 500
        ? message
        : message,
    });

  next();
});

app.listen(PORT);
