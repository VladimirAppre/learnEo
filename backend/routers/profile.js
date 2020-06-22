const router = require('express').Router();
const User = require('../models/user');

router.route('/:id')
  .get(async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id }).populate('canTeach').populate('toLearn');
      const {
        _id,
        firstName,
        lastName,
        rating,
        city,
        trainingFormat,
        aboutUser,
        canTeach,
        toLearn,
        photos,
        avatar,
        feedBacks,
      } = user;
      res.status(200).json({
        _id,
        firstName,
        lastName,
        rating,
        city,
        trainingFormat,
        aboutUser,
        canTeach,
        toLearn,
        photos,
        avatar,
        feedBacks,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })
  .post(async (req, res) => {
    if(req.session.user) {
    try {
      const userChange = await User.findOne({ _id: req.params.id });
      const {
        aboutUser,
        canTeach,
        toLearn,
        firstName,
        lastName,
        city,
        trainingFormat,
        avatar,
      } = req.body;
      if (userChange.aboutUser !== aboutUser) {
        userChange.aboutUser = aboutUser
      }
      if (userChange.canTeach !== canTeach) {
        userChange.canTeach = canTeach;
      }
      if (userChange.toLearn !== toLearn) {
        userChange.toLearn = toLearn;
      }
      if (userChange.firstName !== firstName) {
        userChange.firstName = firstName;
      }
      if (userChange.lastName !== lastName) {
        userChange.lastName = lastName;
      }
      if (userChange.city !== city) {
        userChange.city = city;
      }
      if (userChange.trainingFormat !== trainingFormat) {
        userChange.trainingFormat = trainingFormat;
      }
      if (userChange.avatar !== avatar) {
        userChange.avatar = avatar;
      }
      await userChange.save();
      const userSend = await User.findOne({ _id: req.params.id }).populate('canTeach').populate('toLearn');
      delete userSend.password;
      return res.status(200).json({ userSend });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.status(200).json({error: 'Вы не вошли в систему'})
  })

router.route('/:id/feedback')
  .post(async (req, res) => {
    if(req.session.user) {
    try {
      const newDate = String(new Date()).slice(4, 24);
      let user = await User.findOne({ _id: req.params.id }).populate('canTeach').populate('toLearn');
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      let alreadyHave;
      user.feedBacks.forEach((element) => {
        if (element.id === req.body.id) {
          return alreadyHave = true;
        };
        return alreadyHave = false;
      });
      if (alreadyHave) {
        return res.status(200).json({ alreadyFeedback: true })
      } else {
        user.feedBacks.push({
          id: req.body.id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          message: req.body.message,
          rate: req.body.rating,
          avatar: req.body.avatar,
          date: newDate
        });
      };
      let ratingSum = 0;
      user.feedBacks.forEach((feedback) => {
        ratingSum += Number(feedback.rate);
      })
      user.rating = ratingSum / user.feedBacks.length;  
      await user.save();
      const {rating, feedBacks} = user;
      return res.status(200).json({succes: true, user: {rating, feedBacks}});
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  console.log(req.session.user);
  res.status(200).json({error: 'Вы не вошли в систему'});
  });

module.exports = router;
