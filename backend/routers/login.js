const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  try {
    const { email, password: bodyPassword } = req.body;
    const user = await User.findOne({ email: email }).populate('canTeach').populate('toLearn');
    if (!user) {
      return res.status(200).json({ error: 'Пользователя с таким email не существует' })
    } else {
      user.lastActivity = String(new Date()).slice(4, 24);
      await user.save();
      const {
        _id,
        firstName,
        lastName,
        city,
        trainingFormat,
        aboutUser,
        toLearn,
        canTeach,
        password,
        lastActivity,
        avatar,
        feedBacks,
      } = user;
      bcrypt.compare(bodyPassword, user.password, function (err, result) {
        if (result && result == true) {
          req.session.user = user;
          const logUser = {
            toLearn,
            canTeach,
            _id,
            firstName,
            lastName,
            city,
            trainingFormat,
            aboutUser,
            lastActivity: user.lastActivity,
            avatar,
            feedBacks,
          };
          res.status(200).json({ user: logUser });
        } else {
          res.status(200).json({ error: 'Неправильный пароль' });
        }
      })
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;
