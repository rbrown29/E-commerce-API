const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

/*
    This code is setting up routes for a user authentication. 
    The first line is importing the authentication controller functions, register, login, and logout. 
    The following lines are setting up routes for each of those functions, 
    with the HTTP method (POST or GET) and the corresponding controller function.
*/
const { register, login, logout, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', authenticateUser ,logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);

module.exports = router;