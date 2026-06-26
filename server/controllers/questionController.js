const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.getAll = async (req, res, next) => {
  try {
    const { search, tag, company, difficulty, sort, page, limit } = req.query;
    const result = await Question.findAll({
      search,
      tag,
      company,
      difficulty,
      sort,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    await Question.incrementViews(req.params.id);
    question.views += 1;

    const user_id = req.user ? req.user.id : null;
    const answers = await Answer.findByQuestionId(req.params.id, user_id);
    question.answers = answers;

    res.json(question);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description, tags, company, difficulty } = req.body;
    const tagStr = Array.isArray(tags) ? tags.join(',') : (tags || '');
    const question = await Question.create({
      title,
      description,
      tags: tagStr,
      company: company || '',
      difficulty: difficulty || 'medium',
      user_id: req.user.id,
    });
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    if (question.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const { title, description, tags, company, difficulty } = req.body;
    const tagStr = Array.isArray(tags) ? tags.join(',') : (tags || '');
    await Question.update(req.params.id, { title, description, tags: tagStr, company, difficulty });
    res.json({ message: 'Question updated.' });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    if (question.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await Question.delete(req.params.id);
    res.json({ message: 'Question deleted.' });
  } catch (err) {
    next(err);
  }
};

exports.getTrending = async (req, res, next) => {
  try {
    const questions = await Question.getTrending(parseInt(req.query.limit) || 10);
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Question.getTags();
    res.json(tags);
  } catch (err) {
    next(err);
  }
};

exports.getByCompany = async (req, res, next) => {
  try {
    const { company } = req.params;
    if (!company) {
      return res.status(400).json({ message: 'Company parameter required.' });
    }
    const questions = await Question.getByCompany(company);
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

exports.getCompanies = async (_req, res, next) => {
  try {
    const companies = await Question.getCompanies();
    res.json(companies);
  } catch (err) {
    next(err);
  }
};
