require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./config/db');
const fs = require('fs');

const schemaPath = path.join(__dirname, 'database', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema, (err) => {
  if (err) console.error('Schema init error:', err.message);
});

db.run("ALTER TABLE questions ADD COLUMN difficulty TEXT DEFAULT 'medium' CHECK(difficulty IN ('easy', 'medium', 'hard'))", (err) => {
  if (err && !err.message.includes('duplicate column')) {
    console.error('Migration error:', err.message);
  }
});

db.get('SELECT COUNT(*) as count FROM questions', (err, row) => {
  if (!err && row && row.count === 0) {
    require('./database/seed')().catch((e) => console.error('Auto-seed error:', e.message));
  }
});

const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');
const voteRoutes = require('./routes/voteRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/users', userRoutes);

app.post('/api/seed', async (_req, res) => {
  try {
    await require('./database/seed')();
    res.json({ message: 'Database seeded successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed: ' + err.message });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
