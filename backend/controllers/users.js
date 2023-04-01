const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const IncorrectError = require('../errors/IncorrectError');
const ExistsEmailError = require('../errors/ExistsEmailError');
const AuthorizationError = require('../errors/AuthorizationError');

const { JWT_SECRET } = require('../constants');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (user) {
      res.json(user);
    } else {
      throw new NotFoundError('User not found');
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new IncorrectError('Некорректный Id'));
    } else {
      next(error);
    }
  }
};

module.exports.getMe = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports.patchUser = async (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  try {
    const newName = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (newName) {
      res.json(newName);
    } else {
      throw new NotFoundError('User not found');
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new IncorrectError('ValidationError'));
    } else {
      next(error);
    }
  }
};

module.exports.patchUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    const newAvatar = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (newAvatar) {
      res.json(newAvatar);
    } else {
      throw new NotFoundError('User not found');
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new IncorrectError('ValidationError'));
    } else {
      next(error);
    }
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create(new User({
      name,
      about,
      avatar,
      email,
      password: hash,
    }));

    res.status(201).json({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new IncorrectError('ValidationError'));
    } else if (error.code === 11000) {
      next(new ExistsEmailError('Пользователь с этой почтой уже существует'));
    } else {
      next(error);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthorizationError('Неправельные логин или пароль');
    }

    const login = bcrypt.compare(password, user.password);
    if (!login) {
      throw new AuthorizationError('Неправельные логин или пароль');
    }

    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    res.cookie(
      'jwt',
      token,
      { maxAge: 3600000 * 24 * 7 },
      { httpOnly: true },
    ).json({ message: 'Вход прошел успешно' });
  } catch (error) {
    next(error);
  }
};
