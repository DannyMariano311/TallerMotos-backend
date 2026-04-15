const AuthService = require('../services/authService');

class AuthController {
  /**
   * Register new user (only ADMIN can register)
   */
  static async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({
          error: 'name, email, and password are required'
        });
      }

      // Only ADMIN can create users
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Solo administradores pueden registrar nuevos usuarios'
        });
      }

      const user = await AuthService.register({
        name,
        email,
        password,
        role: role || 'MECANICO'
      });

      return res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: 'email and password are required'
        });
      }

      const result = await AuthService.login(email, password);

      // Set refresh token in secure cookie (optional)
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user
      });
    } catch (error) {
      // Generic error message for failed login
      if (error.message.includes('inválidas')) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  static async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: 'refreshToken is required'
        });
      }

      const tokens = await AuthService.refreshAccessToken(refreshToken);

      // Update refresh token in cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        message: 'Token refrescado exitosamente',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
    } catch (error) {
      return res.status(401).json({
        error: 'Token inválido o expirado'
      });
    }
  }

  /**
   * Logout user (optional - mainly for refresh token revocation)
   */
  static async logout(req, res, next) {
    try {
      // Clear refresh token from cookie
      res.clearCookie('refreshToken');

      return res.status(200).json({
        message: 'Sesión cerrada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(req, res, next) {
    try {
      const user = await AuthService.getUserById(req.user.id);

      return res.status(200).json({
        user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update current user profile
   */
  static async updateProfile(req, res, next) {
    try {
      const { name, email } = req.body;

      const user = await AuthService.updateUser(req.user.id, {
        name,
        email
      });

      return res.status(200).json({
        message: 'Perfil actualizado exitosamente',
        user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
