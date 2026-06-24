const express = require('express');
const router = express.Router();
const { create, update, delete: deleteAnswer } = require('../controllers/answerController');
const { validateAnswer } = require('../middleware/validationMiddleware');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, validateAnswer, create);
router.put('/:id', authenticate, validateAnswer, update);
router.delete('/:id', authenticate, deleteAnswer);

module.exports = router;
