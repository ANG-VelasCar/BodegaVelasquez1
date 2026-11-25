const express = require('express');
const requireAdmin = require('../middleware/require-admin');

const router = express.Router();

router.get('/me', requireAdmin, (req, res) => {
  res.json({ success: true, data: req.admin });
});

module.exports = router;
