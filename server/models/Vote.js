const db = require('../config/db');

const Vote = {
  upsert({ answer_id, user_id, vote_type }) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM votes WHERE answer_id = ? AND user_id = ?',
        [answer_id, user_id],
        (err, existing) => {
          if (err) return reject(err);

          if (existing) {
            if (existing.vote_type === vote_type) {
              db.run(
                'DELETE FROM votes WHERE id = ?',
                [existing.id],
                function (err) {
                  if (err) return reject(err);
                  resolve({ action: 'removed' });
                }
              );
            } else {
              db.run(
                'UPDATE votes SET vote_type = ? WHERE id = ?',
                [vote_type, existing.id],
                function (err) {
                  if (err) return reject(err);
                  resolve({ action: 'changed' });
                }
              );
            }
          } else {
            db.run(
              'INSERT INTO votes (answer_id, user_id, vote_type) VALUES (?, ?, ?)',
              [answer_id, user_id, vote_type],
              function (err) {
                if (err) return reject(err);
                resolve({ action: 'created' });
              }
            );
          }
        }
      );
    });
  },

  getCounts(answer_id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT
          COALESCE(SUM(CASE WHEN vote_type = 'upvote' THEN 1 ELSE 0 END), 0) as upvotes,
          COALESCE(SUM(CASE WHEN vote_type = 'downvote' THEN 1 ELSE 0 END), 0) as downvotes
         FROM votes WHERE answer_id = ?`,
        [answer_id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  },

  getUserVote(answer_id, user_id) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT vote_type FROM votes WHERE answer_id = ? AND user_id = ?',
        [answer_id, user_id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row ? row.vote_type : null);
        }
      );
    });
  },
};

module.exports = Vote;
