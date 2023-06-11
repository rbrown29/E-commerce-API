const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');

const sendEmail = async ({to, subject, html}) => {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport(nodemailerConfig);

    return transporter.sendMail({
        from: '"coding" <test@example.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        html, // html body
      });
    
};

module.exports = sendEmail;