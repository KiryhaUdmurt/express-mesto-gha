const express = require('express');
const mongoose = require('mongoose');

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

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
