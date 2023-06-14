const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        maxlength: [50,`Product name can't be more than 50 characters`],
        minlength: [3,`Product name can't be less than 3 characters`],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        default: 0,
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
        maxlength: [500, `Product description can't be more than 500 characters`],
        minlength: [10, `Product description can't be less than 10 characters`],
    },
    image: {
        type: String,
        required: [true, 'Please provide product image'],
        default: '/uploads/example.jpg',
    },
    category: {
        type: String,
        required: [true, 'Please provide product catagory'],
        enum: {
            values: [
                'phone',
                'laptop',
                'computer',
                'game console',
                'headphones'
            ],
        },
    },
    company: {
        type: String,
        required: [true, 'Please provide product company'],
        enum: {
            values: [
                'apple',
                'dell',
                'hp',
                'microsoft',
            ],
            message: '{VALUE}' + 'is not supported',
        },
    },
    colors: {
        type: [String],
        default: ['#222'],
        required: true,
    },
    featured : {
        type: Boolean,
        default: false,
    },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    inventory: {
        type: Number,
        required: [true, 'Please provide product inventory'],
        default: 15,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
});

ProductSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
    next();
});



module.exports = mongoose.model('Product', ProductSchema);