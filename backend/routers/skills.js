const router = require('express').Router();
const Skill = require('../models/skill');

router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json({ skills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;
