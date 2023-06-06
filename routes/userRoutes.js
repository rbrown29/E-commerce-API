const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

/*
    This code is a set of routes for the user controller. 
    The first route allows an admin to get all users, 
    the second route allows a user to show themselves, 
    the third route allows a user to update their profile, 
    the fourth route allows a user to update their password, 
    and the fifth route allows any authenticated user to get a specific user.
*/
const { 
    getAllUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
 } = require('../controllers/userController');

router.route('/').get(authenticateUser, authorizePermissions('admin')  ,getAllUsers);

// keep this route above the /:id route
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);


router.route('/:id').get(authenticateUser, getUser);  



module.exports = router;