const express = require('express');
const router = express.Router();

const {
    authenticateUser,
    authorizePermissions,
} = require('../middleware/authentication');

const {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
} = require('../controllers/productController');

// alternative way to import the Reviews

// const { getReviewsByProduct } = require('../controllers/reviewController');

router.route('/uploadImage').post(authenticateUser, authorizePermissions('admin'), uploadImage);
router.route('/').post(authenticateUser, authorizePermissions('admin'), createProduct).get(getAllProducts);
router.route('/:id').get(getProduct).patch(authenticateUser, authorizePermissions('admin'), updateProduct).delete(authenticateUser, authorizePermissions('admin'), deleteProduct);

// alternative way to import the Reviews

// router.route('/:id/reviews').get(getReviewsByProduct);

module.exports = router;
