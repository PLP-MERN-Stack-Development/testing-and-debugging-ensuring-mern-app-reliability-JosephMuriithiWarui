function errorHandler(err, req, res, next) {
  // Simple server-side logging for debugging
  /* eslint-disable no-console */
  console.error('Error:', err.message);
  /* eslint-enable no-console */
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
}

module.exports = errorHandler;
