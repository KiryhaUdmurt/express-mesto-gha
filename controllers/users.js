const userModel = require('../models/user');
const {
  SERVER_ERR,
  BAD_REQ,
  NOTFOUND_ERR,
} = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (err) {
    res.status(SERVER_ERR).send({
      message: 'Internal Server Error',
    });
    console.log(err.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(NOTFOUND_ERR).send({ message: 'Пользователя с данным id не существует' });
      return;
    }
    res.send(user);
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

const createUser = async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    res.status(201).send(user);
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

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      res.status(NOTFOUND_ERR).send({ message: 'Пользователя с данным id не существует' });
      return;
    }
    res.send(updatedUser);
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

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedAvatar = await userModel.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    );
    if (!updatedAvatar) {
      res.status(NOTFOUND_ERR).send({ message: 'Пользователя с данным id не существует' });
      return;
    }
    res.send(updatedAvatar);
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
