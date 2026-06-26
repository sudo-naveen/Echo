function validateRegistration(req, res, next) {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters.');
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email is required.');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters.');
  }

  if (errors.length) {
    return res.status(400).json({ message: errors.join(' ') });
  }
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  next();
}

function validateQuestion(req, res, next) {
  const { title, description } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    errors.push('Title must be at least 5 characters.');
  }
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters.');
  }

  if (errors.length) {
    return res.status(400).json({ message: errors.join(' ') });
  }
  next();
}

function validateAnswerCreate(req, res, next) {
  const { content, question_id } = req.body;
  if (!content || typeof content !== 'string' || content.trim().length < 2) {
    return res.status(400).json({ message: 'Answer content must be at least 2 characters.' });
  }
  if (!question_id || isNaN(parseInt(question_id))) {
    return res.status(400).json({ message: 'Valid question_id is required.' });
  }
  next();
}

function validateAnswerUpdate(req, res, next) {
  const { content } = req.body;
  if (!content || typeof content !== 'string' || content.trim().length < 2) {
    return res.status(400).json({ message: 'Answer content must be at least 2 characters.' });
  }
  next();
}

module.exports = { validateRegistration, validateLogin, validateQuestion, validateAnswerCreate, validateAnswerUpdate };
