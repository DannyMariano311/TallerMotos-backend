const express = require('express');
const rateLimit = require('express-rate-limit');
const AuthController = require('../controllers/authController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const checkEmptyBody = require('../middleware/checkEmptyBody');

const router = express.Router();

// Rate limiter for login endpoint (5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Demasiados intentos de inicio de sesión. Intente más tarde.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

router.post('/register', checkEmptyBody, authenticateToken, isAdmin, AuthController.register);
router.post('/login', loginLimiter, checkEmptyBody, AuthController.login);
router.post('/refresh', checkEmptyBody, AuthController.refresh);
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/me', authenticateToken, AuthController.getCurrentUser);
router.put('/me', authenticateToken, checkEmptyBody, AuthController.updateProfile);

module.exports = router;
