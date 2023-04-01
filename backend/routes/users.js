const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const { linkPattern, idPattern } = require('../constants');

const {
  getUsers,
  getUser,
  patchUser,
  getMe,
  patchUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), patchUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(linkPattern),
  }),
}), patchUserAvatar);

router.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().required().regex(idPattern),
  }),
}), getUser);

module.exports = router;
