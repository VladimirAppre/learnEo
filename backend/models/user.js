const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
  },
  lastActivity: {
    type: Date,
  },
  city: {
    type: String,
  },
  trainingFormat: {
    type: String,
  },
  avatar: {
    type: String,
  },
  photos: {
    type: Array,
  },
  rating: {
    type: Number,
  },
  aboutUser: {
    type: String,
  },
  canTeach: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  }],
  toLearn: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  }],
  feedBacks: {
    type: Array,
  },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  }],
});

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);
