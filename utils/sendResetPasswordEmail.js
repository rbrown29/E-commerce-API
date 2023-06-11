const sendEmail = require('./sendEmail');

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
    const resetUrl = `${origin}/user/reset-password?token=${token}&email=${email}`;
    const message = `<p>Please click on the following link to reset your password:
    <a href="${resetUrl}">Reset Password</p>`;

    return sendEmail({
        to: email,
        subject: 'Reset Password',
        html: `<h4>Hello ${name}</h4>
        ${message}
        `,
    });
}

module.exports = sendResetPasswordEmail;