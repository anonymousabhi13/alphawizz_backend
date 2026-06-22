const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const { ConflictError, BadRequestError, UnauthorizedError } = require('../utils/errors');

class AuthService {
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }

  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword
    });

    const token = this.generateToken(user.id);
    
    // Return sanitized user details
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        status: user.status
      }
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError('User account is inactive');
    }

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        status: user.status
      }
    };
  }
}

module.exports = new AuthService();
