const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

// router.post('/signup', createUser);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

router.get('/users/me', getUser);

module.exports = router;
