const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');

const {
  SERVER_ERR,
  BAD_REQ,
  NOTFOUND_ERR,
  ALREADY_EXISTS,
  WRONG_EMAIL,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-req-err');
const AlreadyExistsError = require('../errors/already-exists-err');
const AuthError = require('../errors/auth-err');

const { SECRET_KEY = 'some-secret-key' } = process.env;

const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find({});
    if (!users) {
      throw new NotFoundError('Пользователи не найдены');
    }
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await userModel.findById(_id);
    if (!user) {
      throw new NotFoundError('Пользователя с данным id не существует');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(err);
  }
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      userModel.create({ name, about, avatar, email, password: hash })
        .then((user) => {
          res.status(201).send({ name, about, avatar, email });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new AlreadyExistsError('Пользователь с данным email уже существует'));
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные'));
          }
          next(err);
        });
    });
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      throw new NotFoundError('Пользователя с данным id не существует');
    }
    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(err);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatedAvatar = await userModel.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    );
    if (!updatedAvatar) {
      throw new NotFoundError('Пользователя с данным id не существует');
    }
    res.send(updatedAvatar);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
    if (!token) {
      throw new AuthError('Неправильные почта или пароль');
    }
    res.send({ token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(err);
  }
};

// const login = (req, res) => {
//   const { email, password } = req.body;

//   return userModel.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
//       res.send({ token });
//     })
//     .catch((err) => {
//       // ошибка аутентификации
//       res
//         .status(401)
//         .send({ message: err.message });
//     });
// };

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUser,
};
