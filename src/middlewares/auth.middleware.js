const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const userRepository = require('../repositories/user.repository');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('You are not logged in. Please log in to get access.');
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new UnauthorizedError('Invalid token. Please log in again.');
    }

    // Check if user still exists
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new UnauthorizedError('The user belonging to this token no longer exists.');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError('This user account is inactive.');
    }

    // Grant access to route
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
