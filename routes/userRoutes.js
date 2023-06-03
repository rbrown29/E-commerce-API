const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

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