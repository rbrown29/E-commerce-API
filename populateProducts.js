require('dotenv').config();

const mockData = require('./mock-data/products.json');

const Product = require('./models/product');

const connectDB = require('./db/connect');

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Product.create(mockData);
        console.log('Success!');
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }

}
start();