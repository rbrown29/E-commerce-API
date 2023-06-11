const sendEmail = require('./sendEmail');

const sendVerificationEmail = ({ name, email, verificationToken, origin }) => {

const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
const message = `<p>Please confirm your email address by clicking on the following link:
<a href="${verifyEmail}">Verify Email</p>`;

return sendEmail({
    to: email,
    subject: ' Email Confirmation',
    html: `<h4>Hello ${name}</h4>
    ${message}
    `,
});
};

module.exports = sendVerificationEmail;