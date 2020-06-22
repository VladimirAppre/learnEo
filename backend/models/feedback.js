const mongoose = require('mongoose');

const feedBackSchema = new mongoose.Schema({
  feedBacks: {
    type: Array,
  },
});


// Структура Array
/* [
  {
    firstName: 'string',
    lastName: 'string',

    или

    author: 'string', // firstName + lastName

    message: 'string',
    date: 'String(new Date().slice(16,24))',
    raiting: number,
  }, 
  {
    firstName: 'string',
    lastName: 'string',

    или

    author: 'string', // firstName + lastName

    message: 'string',
    date: 'String(new Date().slice(16,24))',
    raiting: number,
  },
  ...
] */

module.exports = mongoose.model('Feedback', feedBackSchema);
