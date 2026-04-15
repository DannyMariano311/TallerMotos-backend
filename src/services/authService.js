const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');

const User = db.User;

class AuthService {
  /**
   * Hash password with bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  static async hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} True if password matches
   */
  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT access token
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  static generateAccessToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    
    return token;
  }

  /**
   * Generate JWT refresh token (optional)
   * @param {Object} user - User object
   * @returns {string} Refresh token
   */
  static generateRefreshToken(user) {
    const payload = {
      id: user.id,
      email: user.email
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-this',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
    
    return token;
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token
   * @throws Error if token is invalid
   */
  static verifyToken(token) {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this'
    );
  }

  /**
   * Verify refresh token
   * @param {string} token - Refresh token
   * @returns {Object} Decoded token
   * @throws Error if token is invalid
   */
  static verifyRefreshToken(token) {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-this'
    );
  }

  /**
   * Register new user (only ADMIN can register)
   * @param {Object} userData - User data {name, email, password, role}
   * @returns {Promise<Object>} User object
   */
  static async register(userData) {
    const { name, email, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hash password
    const password_hash = await this.hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password_hash,
      role: role || 'MECANICO',
      active: true
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} {accessToken, refreshToken, user}
   */
  static async login(email, password) {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Credenciales inválidas'); // Generic message for security
    }

    // Check if user is active
    if (!user.active) {
      throw new Error('Usuario inactivo');
    }

    // Compare passwords
    const isPasswordValid = await this.comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
        role: user.role
      }
    };
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} {accessToken, refreshToken}
   */
  static async refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyRefreshToken(refreshToken);
      
      const user = await User.findByPk(decoded.id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Token de refresco inválido');
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  static async getUserById(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  static async updateUser(userId, updateData) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Only allow certain fields to be updated
    const allowedFields = ['name', 'email'];
    const updates = {};

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    await user.update(updates);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    };
  }
}

module.exports = AuthService;
