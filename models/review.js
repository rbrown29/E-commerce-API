const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide rating between 1 and 5'],
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide review title'],
        maxlength: 100,
    },
    comment: {
        type: String,
        required: [true, 'Please provide review comment'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
}, { timestamps: true });

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calcAverageRatings = async function (productId) {
    const result = await this.aggregate([
        {
            '$match': {
                'product': productId
            },
        }, {
            '$group': {
                '_id': null,
                'averageRating': {
                    '$avg': '$rating'
                },
                'numOfReviews': {
                    '$sum': 1
                }
            },
        },
    ]);
    console.log(result);
    try {
        await this.model('Product').findByIdAndUpdate({ _id: productId }, {
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0,
        });
    }
    catch (err) {
        console.log(err);
    }

}

ReviewSchema.post('save', async function () {
    await this.constructor.calcAverageRatings(this.product);
});

ReviewSchema.pre('remove', async function () {
    await this.constructor.calcAverageRatings(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);