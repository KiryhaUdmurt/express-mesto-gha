const cardModel = require('../models/card');
const {
  SERVER_ERR,
  VALIDATION_ERR,
  NOTFOUND_ERR,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await cardModel.find({});
    res.send(cards);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(VALIDATION_ERR).send({
        message: 'Переданы некорректные данные',
        err: err.message,
        stack: err.stack,
      });
      return;
    }
    res.status(SERVER_ERR).send({
      message: 'Internal Server Error',
      err: err.message,
      stack: err.stack,
    });
  }
};

const createCard = async (req, res) => {
  try {
    const card = await cardModel.create({
      ...req.body,
      owner: req.user._id,
    });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(VALIDATION_ERR).send({
        message: 'Переданы некорректные данные',
        err: err.message,
        stack: err.stack,
      });
      return;
    }
    res.status(SERVER_ERR).send({
      message: 'Internal Server Error',
      err: err.message,
      stack: err.stack,
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await cardModel.findByIdAndDelete(cardId);
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(NOTFOUND_ERR).send({
        message: 'Карточка с данным id не существует',
        err: err.message,
        stack: err.stack,
      });
      return;
    }
    res.status(SERVER_ERR).send({
      message: 'Internal Server Error',
      err: err.message,
      stack: err.stack,
    });
  }
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const likes = await cardModel.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    res.send(likes);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(VALIDATION_ERR).send({
        message: 'Переданы некорректные данные',
        err: err.message,
        stack: err.stack,
      });
      return;
    }
    if (err.name === 'CastError') {
      res.status(NOTFOUND_ERR).send({
        message: 'Карточка с данным id не существует',
        err: err.message,
        stack: err.stack,
      });
      return;
    }
    res.status(SERVER_ERR).send({
      message: 'Internal Server Error',
      err: err.message,
      stack: err.stack,
    });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const likes = await cardModel.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    res.send(likes);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(VALIDATION_ERR).send({
        message: 'Переданы некорректные данные',
        err: err.message,
        stack: err.stack,
      });
      return;
    }
    if (err.name === 'CastError') {
      res.status(NOTFOUND_ERR).send({
        message: 'Карточка с данным id не существует',
        err: err.message,
        stack: err.stack,
      });
      return;
    }
    res.status(SERVER_ERR).send({
      message: 'Internal Server Error',
      err: err.message,
      stack: err.stack,
    });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
