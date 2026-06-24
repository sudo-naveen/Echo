const db = require('../config/db');

const User = {
  create({ username, email, password }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, username, email });
        }
      );
    });
  },

  findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  },

  getQuestions(id) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT id, title, tags, company, status, views, created_at FROM questions WHERE user_id = ? ORDER BY created_at DESC',
        [id],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },

  getAnswers(id) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT a.id, a.content, a.created_at, a.question_id, q.title AS question_title
         FROM answers a
         JOIN questions q ON a.question_id = q.id
         WHERE a.user_id = ?
         ORDER BY a.created_at DESC`,
        [id],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },
};

module.exports = User;
