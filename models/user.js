'use strict';

const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
    name: {
        type: String,
        required: 'Name is required'
    },
    email: {
        type: String,
        required: 'Email is required',
        unique: true,
        validate: [validator.isEmail, 'Email is invalid']
    }
});

UserSchema.plugin(uniqueValidator, { message: '{PATH} must be unique'});

module.exports = mongoose.model('User', UserSchema);
