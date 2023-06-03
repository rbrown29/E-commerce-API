const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

/*
    This code is defines routes for the application.
    The first route is for creating an order, and the second route is for getting all orders.
    The third route is for getting a specific order, 
    and the fourth route is for getting the current user's orders. 
    The fifth route is for updating an order. 
    All of these routes require authentication and authorization before they can be accessed.
*/
const {
    createOrder,
    getAllOrders,
    getOrder,
    getCurrentUserOrders,
    updateOrder,
} = require('../controllers/orderController');

router.route('/').post(authenticateUser, createOrder).get(authenticateUser, authorizePermissions('admin'), getAllOrders);
router.route('/myOrders').get(authenticateUser, getCurrentUserOrders);
router.route('/:id').get(authenticateUser, getOrder).patch(authenticateUser, updateOrder);

module.exports = router;


