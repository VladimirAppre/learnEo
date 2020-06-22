const router = require('express').Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;
