function errorHandler(err, req, res, _next) {
  console.error('Error:', err.message || err);

  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({ message: 'Database constraint violation.' });
  }

  if (err.name === 'SyntaxError' && err.status === 400) {
    return res.status(400).json({ message: 'Invalid JSON in request body.' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired.' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.expose ? err.message : 'Internal server error.';

  res.status(statusCode).json({ message });
}

module.exports = { errorHandler };
