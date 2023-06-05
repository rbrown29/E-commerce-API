const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');


/*
    This code is a function that is used to register a new user. 
    It checks if the email address provided already exists, 
    and if it does, it throws an error. If the email address does not exist, 
    it creates a new user with the provided email, name, and password. 
    It then creates a token for the user and attaches cookies to the response. 
    It sends back a status code of "created" and returns the token user in JSON format.
*/
const register = async (req, res) => {
    const { email, name, password } = req.body;
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
        throw new CustomError.BadRequestError('Email already exists');
    }

    const user = await User.create({ email, name, password });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
}

/*
    This code is a login function that checks if the provided email and password are valid. 
    It first checks if an email and password were provided, 
    then looks for a user with the given email in the database. 
    If a user is found, it compares the provided password to the one stored in the database. 
    If they match, it creates a token for the user and attaches it to the response. 
    Finally, it sends an OK status code with the tokenized user back to the client.
*/
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid credentials');
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
}

/*
    This code is setting a cookie with the token 'logout' and 
    setting the expiration date to the current time. 
    It is also setting the secure flag to true if the environment is set to production. 
    Finally, it is sending a response with a status code of OK and a message that the user has been logged out.
*/
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });
    res.status(StatusCodes.OK).json({ msg: 'User logged out' });
}


module.exports = {
    register,
    login,
    logout,
}