const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  firstUser: Object,
  secondUser: Object,
  id: String,
  dateCreation: Date,
  messages: {
    type: Array,
  },
});

module.exports = mongoose.model('Chat', chatSchema);
