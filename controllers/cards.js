const cardModel = require('../models/card');
const {
  SERVER_ERR,
  BAD_REQ,
  NOTFOUND_ERR,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await cardModel.find({});
    res.send(cards);
  } catch (err) {
    res.status(SERVER_ERR).send({
      message: 'Internal Server Error',
    });
    console.log(err.message);
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
      res.status(BAD_REQ).send({
        message: 'Переданы некорректные данные',
      });
      console.log(err.message);
      return;
    }
    res.status(SERVER_ERR).send({
      message: 'Internal Server Error',
    });
    console.log(err.message);
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await cardModel.findByIdAndDelete(cardId);
    if (!card) {
      res.status(NOTFOUND_ERR).send({ message: 'Карточка с данным id не существует' });
      return;
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQ).send({
        message: 'Переданы некорректные данные',
      });
      console.log(err.message);
      return;
    }
    res.status(SERVER_ERR).send({
      message: 'Internal Server Error',
    });
    console.log(err.message);
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
    if (!likes) {
      res.status(NOTFOUND_ERR).send({ message: 'Карточка с данным id не существует' });
      return;
    }
    res.send(likes);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQ).send({
        message: 'Переданы некорректные данные',
      });
      console.log(err.message);
      return;
    }
    res.status(SERVER_ERR).send({
      message: 'Internal Server Error',
    });
    console.log(err.message);
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
    if (!likes) {
      res.status(NOTFOUND_ERR).send({ message: 'Карточка с данным id не существует' });
      return;
    }
    res.send(likes);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQ).send({
        message: 'Переданы некорректные данные',
      });
      console.log(err.message);
      return;
    }
    res.status(SERVER_ERR).send({
      message: 'Internal Server Error',
    });
    console.log(err.message);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
