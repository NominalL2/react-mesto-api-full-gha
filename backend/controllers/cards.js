const Card = require('../models/card');
const {
  NotFoundError,
  IncorrectError,
  AccessDeniedError,
} = require('../errors');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

module.exports.postCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  const card = new Card({ name, link, owner });

  try {
    const newCard = await card.save();
    res.status(201).json(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new IncorrectError('ValidationError'));
    } else {
      next(error);
    }
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    } else if (card.owner != userId) {
      throw new AccessDeniedError('Нельзя удалить чужую карточку');
    } else {
      await card.deleteOne();
      res.json({ message: 'Карточка успешно удалена' });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new IncorrectError('Некорректный Id'));
    } else {
      next(error);
    }
  }
};

module.exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const like = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!like) {
      throw new NotFoundError('Карточка не найдена');
    } else {
      res.json(like);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new IncorrectError('Некорректный Id'));
    } else {
      next(error);
    }
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const dislike = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!dislike) {
      throw new NotFoundError('Карточка не найдена');
    } else {
      res.json(dislike);
    }
  } catch (error) {
    if (error.name === 'CastError') {
      next(new IncorrectError('Некорректный Id'));
    } else {
      next(error);
    }
  }
};
