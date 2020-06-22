const router = require('express').Router();
const User = require('../models/user');

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).populate('canTeach').populate('toLearn');
    const allUsers = await User.find().populate('toLearn').populate('canTeach');

    // Исключаем в сопадениях самого себя
    let matchUsers = allUsers.filter((currUser) => {
      return String(currUser._id) !== String(user._id); 
    });

    // Подбираем пользователей по совпадениям
    let matchingUsers = [];
    user.toLearn.forEach((eachSkill) => {
      matchUsers.forEach((eachUser) => {
        eachUser.canTeach.forEach((skill) => {
          if (String(eachSkill._id) === String(skill._id)) {
            if (!matchingUsers.includes(eachUser)) matchingUsers.push(eachUser);
          }
        });
      });
    });
    res.status(200).json({ matchingUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;
