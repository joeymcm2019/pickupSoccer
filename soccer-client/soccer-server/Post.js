const mongoose = require('mongoose');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const postSchema = new mongoose.Schema ({
    groupID: {type: String, required: true},
    userID: {type: String, required: true},
    content: {type: String, required: true},
}, 
{
    timestamps: true
}
);

postSchema.plugin(passportLocalMongoose);
postSchema.plugin(findOrCreate);

//const User = new mongoose.model('User', userSchema);

module.exports = mongoose.model('Post', postSchema);