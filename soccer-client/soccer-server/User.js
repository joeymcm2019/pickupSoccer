const mongoose = require('mongoose');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema ({
    username: {type: String, required: true, unique: true}, 
    email: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    pickUpGroups: {type: [{}]}
}, 
{
    timestamps: true
}
);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//const User = new mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);