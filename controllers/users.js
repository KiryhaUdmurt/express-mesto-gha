const userModel = require('../models/user');
const {
  SERVER_ERR,
  VALIDATION_ERR,
  NOTFOUND_ERR,
} = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
        err: err.message,
        stack: err.stack,
      });
      return;
    }
    res.status(500).send({
      message: 'Internal Server Error',
      err: err.message,
      stack: err.stack,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(NOTFOUND_ERR).send({
        message: 'Пользователя с данным id не существует',
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

const createUser = async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    res.status(201).send(user);
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

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true },
    );
    res.send(updatedUser);
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
        message: 'Пользователь с данным id не существует',
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

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedAvatar = await userModel.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    );
    res.send(updatedAvatar);
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
        message: 'Пользователь с данным id не существует',
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
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
