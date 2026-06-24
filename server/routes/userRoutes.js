const express = require('express');
const router = express.Router();
const { getProfile, bookmarkQuestion, getBookmarks } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/profile', authenticate, getProfile);
router.post('/bookmarks', authenticate, bookmarkQuestion);
router.get('/bookmarks', authenticate, getBookmarks);

module.exports = router;
