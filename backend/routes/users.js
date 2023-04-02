const router = require('express').Router();

const {
  getUsers,
  getUser,
  patchUser,
  getMe,
  patchUserAvatar,
} = require('../controllers/users');

const {
  patchUsersMeAvatarValidation,
  patchUsersMeValidation,
  getUsersUserIdValidation,
} = require('../validation');

router.get('/', getUsers);

router.get('/me', getMe);

router.patch('/me', patchUsersMeValidation, patchUser);

router.patch('/me/avatar', patchUsersMeAvatarValidation, patchUserAvatar);

router.get('/:userId', getUsersUserIdValidation, getUser);

module.exports = router;
