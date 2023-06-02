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

const getUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await userModel.findById(_id);
    // if (!user) {
    //   res.status(NOTFOUND_ERR).send({ message: 'Пользователя с данным id не существует' });
    //   return;
    // }
    res.send(user);
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

// const createUser = async (req, res) => {
//   try {
//     const user = await userModel.create(req.body);
//     res.status(201).send(user);
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       res.status(BAD_REQ).send({
//         message: 'Переданы некорректные данные',
//       });
//       console.log(err.message);
//       return;
//     }
//     res.status(SERVER_ERR).send({
//       message: 'Internal Server Error',
//     });
//     console.log(err.message);
//   }
// };

// const createUser = async (req, res) => {
//   try {
//     // const { name, about, avatar, email, password } = req.body;
//     const hash = await bcrypt.hash(req.body.password, 10);
//     const user = await userModel.create({
//       ...req.body,
//       password: hash,
//     });
//     res.status(201).send(user);
//   } catch (err) {
//     if (err.code === 11000) {
//       res.status(ALREADY_EXISTS).send({ message: 'Пользователь с данным email уже существует' });
//       console.log(err.message);
//       return;
//     }
//     res.status(SERVER_ERR).send({
//       message: 'Internal Server Error',
//     });
//     console.log(err.message);
//   }
// };

const createUser = (req, res) => {
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
            res.status(ALREADY_EXISTS).send({ message: 'Пользователь с данным email уже существует' });
            console.log(err.message);
            return;
          }
          res.status(SERVER_ERR).send({
            message: 'Internal Server Error',
          });
          console.log(err.message);
        });
    });
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }); // ключ брать из окружения
    res.send({ token });
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
