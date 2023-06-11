module.exports = {
    host: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
}