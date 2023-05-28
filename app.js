const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '646f637704aa1c43a856d8d5',
  };

  next();
});

app.use(router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
