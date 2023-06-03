const Order = require('../models/order');
const Product = require('../models/product');
const { StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({ amount, currency }) => {
    const clientSecret = 'fake-client-secret';
    return {
        clientSecret,
        amount,
    };
}

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;

    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No items in cart');
    }

    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please provide tax and shipping fee');
    }

    let orderItems = [];
    let subTotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product });
        if (!dbProduct) {
            throw new CustomError.NotFoundError(`No product with id : ${item.product}`);
        }
        const { name, price, image, _id } = dbProduct;
        const SingleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id,
        };
        // add item to order items array
        orderItems = [...orderItems, SingleOrderItem];
        // calculate subtotal
        subTotal += item.amount * price;
    }
    // calculate total
    const total = subTotal + tax + shippingFee;
    // get client secret
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
    });
    const order = await Order.create({
        tax,
        shippingFee,
        subTotal,
        total,
        orderItems,
        clientSecret: paymentIntent.clientSecret,
        user: req.user.userId,
    });
    res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret });
}

const getAllOrders = async (req, res) => {
    res.send('get all orders');
}

const getOrder = async (req, res) => {
    res.send('get order');
}

const getCurrentUserOrders = async (req, res) => {
    res.send('get current user orders');
}

const updateOrder = async (req, res) => {
    res.send('update order');
}


module.exports = {
    createOrder,
    getAllOrders,
    getOrder,
    getCurrentUserOrders,
    updateOrder,
}