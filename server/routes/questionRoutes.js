const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { validateQuestion } = require('../middleware/validationMiddleware');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', questionController.getAll);
router.get('/trending', questionController.getTrending);
router.get('/tags', questionController.getTags);
router.get('/companies', questionController.getCompanies);
router.get('/company/:company', questionController.getByCompany);
router.get('/:id', questionController.getById);
router.post('/', authenticate, validateQuestion, questionController.create);
router.put('/:id', authenticate, validateQuestion, questionController.update);
router.delete('/:id', authenticate, questionController.delete);

module.exports = router;
