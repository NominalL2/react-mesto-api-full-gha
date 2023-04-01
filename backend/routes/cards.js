const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const { linkPattern, idPattern } = require('../constants');

const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const cardIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().regex(idPattern),
  }),
});

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(linkPattern),
  }),
}), postCard);

router.delete('/:cardId', cardIdValidation, deleteCard);

router.put('/:cardId/likes', cardIdValidation, likeCard);

router.delete('/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = router;
