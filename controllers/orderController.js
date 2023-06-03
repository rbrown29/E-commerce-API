const Order = require('../models/order');
const Product = require('../models/product');
const { StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

/* This code is a mock Stripe API that returns a client secret and an amount.
   It takes in two parameters, amount and currency,
   and returns an object containing the client secret and the amount.
*/ 
const fakeStripeAPI = async ({ amount, currency }) => {
    const clientSecret = 'fake-client-secret';
    return {
        clientSecret,
        amount,
    };
}
/*
    This code is a function that creates an order.
    It takes in the request body, which contains the items, tax, and shipping fee.
    It then checks if there are any items in the cart and if there is a tax and shipping fee provided.
    It then loops through the items in the cart to get their name, price, image, and product id.
    It then calculates the subtotal of all the items in the cart.
    After that it calculates the total by adding the subtotal, tax, and shipping fee. 
    It creates an order with all of this information and returns it with a client secret for payment processing.
*/
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