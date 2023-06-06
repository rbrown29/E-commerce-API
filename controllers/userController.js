const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils');

/*
    This code is an asynchronous function that is used to get all users with the role of 'user' from a database. 
    It logs the request user, finds all users with the specified role, 
    and then returns a response with the found users and their count.
*/
const getAllUsers = async (req, res) => {
    console.log(req.user);
    const users = await User.find({role: 'user'}).select('-password');
    res.status(StatusCodes.OK).json({ users, count: users.length });
}

/*
    This code is used to retrieve a user from the database. 
    It first checks if the user exists, 
    then checks the permissions of the user, 
    and finally returns the user's data in a JSON format.
*/
const getUser = async (req, res) => {
   const user = await User.findOne({_id: req.params.id}).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
}

/*
    This code is an asynchronous function that takes in two parameters, req and res. 
    It sets the status code to OK and sends a response in JSON format containing the user data from the request object.
*/
const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
}

/*
    This code is an asynchronous function that updates a user's name and email in a database. 
    It first checks if the name and email are provided, and if not, throws an error. 
    Then it finds the user with the given ID and updates their name and email. 
    Finally, it creates a token for the user and attaches it to the response before sending back a status code of OK with the updated user information.
*/
const updateUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new CustomError.BadRequestError('Please provide name and email');
    }

    const user = await User.findOneAndUpdate(
        { _id: req.user.userId },
        { name, email },
        { new: true, runValidators: true }
    );

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
}

/*
    This code is an asynchronous function that updates a user's password. 
    It first checks if both the old and new passwords are provided, 
    then finds the user in the database and compares the old password to make sure it is correct. 
    If the old password is correct, it updates the user's password with the new one and sends a success message.
*/
const updateUserPassword = async (req, res) => {
   const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both old and new password');
    }
    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid credentials');
    }

    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password updated' });
}


module.exports = {
    getAllUsers,
    getUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}