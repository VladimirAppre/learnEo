const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  skill: String,
  skillCategory: String,
});

module.exports = mongoose.model('Skill', skillSchema);
