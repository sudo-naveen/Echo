const express = require('express');
const router = express.Router();
const { create, update, delete: deleteAnswer } = require('../controllers/answerController');
const { validateAnswerCreate, validateAnswerUpdate } = require('../middleware/validationMiddleware');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, validateAnswerCreate, create);
router.put('/:id', authenticate, validateAnswerUpdate, update);
router.delete('/:id', authenticate, deleteAnswer);

module.exports = router;
