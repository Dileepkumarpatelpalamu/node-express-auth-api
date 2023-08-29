const mongoose = require('mongoose');
const authModal = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
        validator: function (value) {
            return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
        },
        message: 'Invalid email format',
        },
    },
    mobileNo:{
        type: String,
        required: true,
        unique:true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
    },
    authToken:{
        type: String,
        required: true,
        trim: true,
    },
    dateOfBirth:{
        type: Date,
        required: false,
    },
    age: {type: Number,min: 18,max: 99}
});
const authUser = mongoose.model('authUser', authModal);
module.exports = authUser;