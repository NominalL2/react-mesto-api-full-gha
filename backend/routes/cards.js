const router = require('express').Router();

const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  cardsIdValidation,
  postCardsValidation,
} = require('../validation');

router.get('/', getCards);

router.post('/', postCardsValidation, postCard);

router.delete('/:cardId', cardsIdValidation, deleteCard);

router.put('/:cardId/likes', cardsIdValidation, likeCard);

router.delete('/:cardId/likes', cardsIdValidation, dislikeCard);

module.exports = router;
