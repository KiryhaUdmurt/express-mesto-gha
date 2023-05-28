const express = require('express');
const mongoose = require('mongoose');
const { NOTFOUND_ERR } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '646f637704aa1c43a856d8d5',
  };

  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.patch('*', (req, res) => {
  res.status(NOTFOUND_ERR).send({ message: 'Некорректный путь' });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
