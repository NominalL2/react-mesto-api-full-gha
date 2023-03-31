const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NotFoundError,
  IncorrectError,
  ExistsEmailError,
  AuthorizationError,
} = require('../errors');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next();
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
    const findEmail = await User.findOne({ email });

    if (findEmail) {
      throw new ExistsEmailError('Пользователь с этой почтой уже существует');
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    const newUser = await user.save();

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
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );
    res.cookie(
      'jwt',
      token,
      { maxAge: 3600000 * 24 * 7 },
      { httpOnly: true },
    ).json({ token });
  } catch (error) {
    next(error);
  }
};
