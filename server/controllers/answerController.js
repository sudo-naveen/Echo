const Answer = require('../models/Answer');

exports.create = async (req, res, next) => {
  try {
    const { content, question_id } = req.body;
    const answer = await Answer.create({
      content,
      question_id,
      user_id: req.user.id,
    });
    res.status(201).json(answer);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found.' });
    }
    if (answer.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const { content } = req.body;
    await Answer.update(req.params.id, { content });
    res.json({ message: 'Answer updated.' });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found.' });
    }
    if (answer.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await Answer.delete(req.params.id);
    res.json({ message: 'Answer deleted.' });
  } catch (err) {
    next(err);
  }
};
