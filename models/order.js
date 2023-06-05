const mongoose = require('mongoose');

/*
    This code is defining a Mongoose schema for an order. 
    The SingleOrderItemsSchema defines the fields of an individual item in the order, 
    such as name, image, price, amount and product. 
    The OrderSchema defines the fields of the order itself, such as tax, shipping fee, sub total and total. 
    It also includes an array of SingleOrderItemsSchema objects and fields for user and payment intent ID.
*/

const SingleOrderItemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
});

const OrderSchema = new mongoose.Schema({
    tax: {
        type: Number,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    orderItems: [SingleOrderItemsSchema],
    status: {
        type: String,
        enum: ['pending', 'failed', 'paid', 'delivered', 'cancelled'],
        default: 'pending',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    clientSecret: {
        type: String,
        required: true,
    },
    paymentIntentId: {
        type: String,
    },

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);