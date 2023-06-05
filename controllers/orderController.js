const Order = require('../models/order');
const Product = require('../models/product');
const { StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

/* 
   This code is a mock Stripe API payment that returns a client secret and an amount.
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

/*
    This code is an asynchronous function that retrieves all orders from a database
    and sends them back in the response with a status code of OK.
    The response also includes the count of orders retrieved.
*/
const getAllOrders = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
}

/*
    This code is an asynchronous function that is used to retrieve an order from a database.
    It takes in two parameters, req and res, which are used to access the request and response objects.
    It then uses the orderId from the request parameters to search for the order in the database. 
    If it finds an order with that id, it checks if the user has permission to access it.
    Finally, it sends a response with the order data in JSON format.
*/
const getOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermissions(req.user, order.user);
    res.status(StatusCodes.OK).json({ order });
}

/*
    This code is used to retrieve the orders of a specific user. 
    It uses the request object (req) to get the user's ID, 
    then it queries the Order database with that ID and 
    returns the orders in a JSON format with a count of how many orders were found.
*/
const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
}

/*
    This code is an asynchronous function that updates an order in a database. 
    It takes two parameters, req and res, and uses them to find the order with the given ID. 
    It then checks the permissions of the user making the request and 
    sets the status of the order to 'paid' and assigns it a payment intent ID. 
    It saves the order and sends a response with an OK status code and a JSON object containing the updated order.
*/
const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermissions(req.user, order.user);
    order.status = 'paid';
    order.paymentIntentId = paymentIntentId;
    await order.save();
    res.status(StatusCodes.OK).json({ order });
}


module.exports = {
    createOrder,
    getAllOrders,
    getOrder,
    getCurrentUserOrders,
    updateOrder,
}