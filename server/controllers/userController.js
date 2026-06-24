const User = require('../models/User');
const db = require('../config/db');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const questions = await User.getQuestions(req.user.id);
    const answers = await User.getAnswers(req.user.id);

    res.json({ user, questions, answers });
  } catch (err) {
    next(err);
  }
};

exports.bookmarkQuestion = async (req, res, next) => {
  try {
    const { question_id } = req.body;

    db.get(
      'SELECT * FROM bookmarks WHERE user_id = ? AND question_id = ?',
      [req.user.id, question_id],
      (err, existing) => {
        if (err) return next(err);
        if (existing) {
          db.run(
            'DELETE FROM bookmarks WHERE id = ?',
            [existing.id],
            function (err) {
              if (err) return next(err);
              res.json({ bookmarked: false });
            }
          );
        } else {
          db.run(
            'INSERT INTO bookmarks (user_id, question_id) VALUES (?, ?)',
            [req.user.id, question_id],
            function (err) {
              if (err) return next(err);
              res.json({ bookmarked: true });
            }
          );
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    db.all(
      `SELECT q.*, u.username,
        (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
       FROM bookmarks b
       JOIN questions q ON b.question_id = q.id
       JOIN users u ON q.user_id = u.id
       WHERE b.user_id = ?
       ORDER BY b.id DESC`,
      [req.user.id],
      (err, rows) => {
        if (err) return next(err);
        res.json(rows);
      }
    );
  } catch (err) {
    next(err);
  }
};
