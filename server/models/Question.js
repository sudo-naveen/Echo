const db = require('../config/db');

const Question = {
  create({ title, description, tags, company, difficulty, user_id }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO questions (title, description, tags, company, difficulty, user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, tags, company || '', difficulty || 'medium', user_id],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, title, description, tags, company, difficulty, user_id });
        }
      );
    });
  },

  findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT q.*, u.username
         FROM questions q
         JOIN users u ON q.user_id = u.id
         WHERE q.id = ?`,
        [id],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  },

  findAll({ search, tag, company, difficulty, sort, page = 1, limit = 10 }) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      const where = [];
      const params = [];

      if (search) {
        where.push('(q.title LIKE ? OR q.description LIKE ? OR q.company LIKE ? OR q.tags LIKE ?)');
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }
      if (tag) {
        where.push('q.tags LIKE ?');
        params.push(`%${tag}%`);
      }
      if (company) {
        where.push('q.company = ?');
        params.push(company);
      }
      if (difficulty) {
        where.push('q.difficulty = ?');
        params.push(difficulty);
      }

      const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

      let orderClause = 'ORDER BY q.created_at DESC';
      if (sort === 'oldest') orderClause = 'ORDER BY q.created_at ASC';
      else if (sort === 'most_viewed') orderClause = 'ORDER BY q.views DESC';
      else if (sort === 'most_answered') orderClause = 'ORDER BY answer_count DESC';

      const countQuery = `SELECT COUNT(*) as total FROM questions q ${whereClause}`;
      const dataQuery = `
        SELECT q.*, u.username,
          (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
        FROM questions q
        JOIN users u ON q.user_id = u.id
        ${whereClause}
        ${orderClause}
        LIMIT ? OFFSET ?
      `;

      db.get(countQuery, params, (err, countRow) => {
        if (err) return reject(err);
        db.all(dataQuery, [...params, limit, offset], (err, rows) => {
          if (err) return reject(err);
          resolve({
            questions: rows,
            total: countRow.total,
            page,
            totalPages: Math.ceil(countRow.total / limit),
          });
        });
      });
    });
  },

  getTrending(limit = 10) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT q.*, u.username,
          (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
         FROM questions q
         JOIN users u ON q.user_id = u.id
         ORDER BY (q.views * 3 + answer_count * 5 + q.id) DESC, q.created_at DESC
         LIMIT ?`,
        [limit],
        (err, rows) => {
          if (err) {
            db.all(
              `SELECT q.*, u.username,
                (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
               FROM questions q
               JOIN users u ON q.user_id = u.id
               ORDER BY q.created_at DESC
               LIMIT ?`,
              [limit],
              (err2, rows2) => {
                if (err2) return reject(err2);
                resolve(rows2);
              }
            );
          } else {
            resolve(rows);
          }
        }
      );
    });
  },

  getByCompany(company, limit = 20) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT q.*, u.username,
          (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
         FROM questions q
         JOIN users u ON q.user_id = u.id
         WHERE q.company = ?
         ORDER BY q.views DESC
         LIMIT ?`,
        [company, limit],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },

  getCompanies() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT company, COUNT(*) as count
         FROM questions
         WHERE company != '' AND company IS NOT NULL
         GROUP BY company
         ORDER BY count DESC`,
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },

  update(id, { title, description, tags, company, difficulty }) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE questions SET title = ?, description = ?, tags = ?, company = ?, difficulty = ? WHERE id = ?',
        [title, description, tags, company || '', difficulty || 'medium', id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM questions WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  },

  incrementViews(id) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE questions SET views = views + 1 WHERE id = ?',
        [id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  },

  getTags() {
    return new Promise((resolve, reject) => {
      db.all(
        `WITH RECURSIVE split(tag, rest) AS (
           SELECT '', tags || ',' FROM questions
           UNION ALL
           SELECT
             TRIM(SUBSTR(rest, 1, INSTR(rest, ',') - 1)),
             SUBSTR(rest, INSTR(rest, ',') + 1)
           FROM split WHERE rest != ''
         )
         SELECT tag, COUNT(*) as count
         FROM split WHERE tag != ''
         GROUP BY tag
         ORDER BY count DESC`,
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },
};

module.exports = Question;
