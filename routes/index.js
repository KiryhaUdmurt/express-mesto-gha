const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { NOTFOUND_ERR } = require('../utils/constants');

router.use('/', userRouter);
router.use('/', cardRouter);
router.use('*', (req, res) => {
  res.status(NOTFOUND_ERR).send({ message: 'Некорректный путь' });
});

module.exports = router;
