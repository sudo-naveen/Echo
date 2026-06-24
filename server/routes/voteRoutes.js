const express = require('express');
const router = express.Router();
const { vote } = require('../controllers/voteController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, vote);

module.exports = router;
