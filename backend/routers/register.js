const router = require('express').Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirm } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ error: 'Пользователь с таким email уже зарегистрирован' });
    } else if (password !== confirm) {
      res.status(200).json({ error: 'Введенные пароли не совпадают' });
    } else {
      const lastActivity = String(new Date()).slice(4, 24);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        lastActivity: lastActivity,
      });
      await newUser.save();
      req.session.user = newUser;
      const logUser = {
        _id: newUser._id,
        toLearn: newUser.toLearn,
        canTeach: newUser.canTeach,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        rating: newUser.rating,
        city: newUser.city,
        trainingFormat: newUser.trainingFormat,
        aboutUser: newUser.aboutUser,
        lastActivity: newUser.lastActivity,
      };
      res.status(200).json({ user: logUser });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;
