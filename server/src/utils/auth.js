const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

function generateToken(user) {
  const payload = { id: user._id?.toString ? user._id.toString() : user._id };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { generateToken, authMiddleware };
