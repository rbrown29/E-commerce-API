const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/authentication');

const {
    createReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview,
} = require('../controllers/reviewController');

router.route('/').post(authenticateUser, createReview).get(getAllReviews);
router.route('/:id').get(getReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview);

module.exports = router;