const createOrder = async (req, res) => {
    res.send('create order');
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