const db = require('../config/db');

const Answer = {
  create({ content, question_id, user_id }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO answers (content, question_id, user_id) VALUES (?, ?, ?)',
        [content, question_id, user_id],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, content, question_id, user_id });
        }
      );
    });
  },

  findByQuestionId(question_id, user_id) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT a.*, u.username,
          COALESCE(upvotes.cnt, 0) as upvotes,
          COALESCE(downvotes.cnt, 0) as downvotes
         FROM answers a
         JOIN users u ON a.user_id = u.id
         LEFT JOIN (SELECT answer_id, COUNT(*) as cnt FROM votes WHERE vote_type = 'upvote' GROUP BY answer_id) upvotes
           ON a.id = upvotes.answer_id
         LEFT JOIN (SELECT answer_id, COUNT(*) as cnt FROM votes WHERE vote_type = 'downvote' GROUP BY answer_id) downvotes
           ON a.id = downvotes.answer_id
         WHERE a.question_id = ?
         ORDER BY upvotes DESC, a.created_at DESC`,
        [question_id],
        (err, rows) => {
          if (err) return reject(err);
          if (user_id) {
            const promises = rows.map((row) => {
              return new Promise((resolve2) => {
                db.get(
                  'SELECT vote_type FROM votes WHERE answer_id = ? AND user_id = ?',
                  [row.id, user_id],
                  (err2, voteRow) => {
                    resolve2({ ...row, userVote: voteRow ? voteRow.vote_type : null });
                  }
                );
              });
            });
            Promise.all(promises).then(resolve);
          } else {
            resolve(rows.map((r) => ({ ...r, userVote: null })));
          }
        }
      );
    });
  },

  findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT a.*, u.username
         FROM answers a
         JOIN users u ON a.user_id = u.id
         WHERE a.id = ?`,
        [id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  },

  update(id, { content }) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE answers SET content = ? WHERE id = ?',
        [content, id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM answers WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  },
};

module.exports = Answer;
