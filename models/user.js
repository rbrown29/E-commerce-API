const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

/*
    This code is creating a Mongoose schema for a user model. 
    It defines the fields that will be stored in the database for each user, such as name, email, password, and role. 
    It also includes methods for hashing passwords and comparing passwords with Bcrypt and genSalt. 
    It also exports the model so that it can be used in other parts of the application.
*/
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
        },

    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
});

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);