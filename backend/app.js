require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const NotFoundError = require('./errors/NotFoundError');
const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');
const errorHandling = require('./middlewares/errorHandling');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { MONGO_DB } = require('./constants');
const {
  signupValidation,
  signinValidation,
} = require('./validation');

const router = express.Router();

const { PORT = '3000' } = process.env;

const app = express();

app.use(express.json());

app.use(cookieParser());

mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signin', signinValidation, login);

app.post('/signup', signupValidation, createUser);

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

app.use(errorHandling);

app.listen(PORT);
