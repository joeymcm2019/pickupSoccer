const mongoose = require('mongoose');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
//const Post = require("./Post");

const pickUpGroupSchema = new mongoose.Schema ({
    privacy: {type: String, required: true},
    creatorUsername: {type: String, required: true},
    state: {type: String, required: true},
    city: {type: String, required: true},
    ageGroup: {type: String, required: true},
    groupName: {type: String, required: true},
    competitiveness: {type: String},
    playTimes: {type: Object},
    playArea: {type: String},
    players: {type: [String]},
    postIDs: {type: [String]},
    id: {type: String, unique: true},
    username: {type: String, unique: false}
});

pickUpGroupSchema.plugin(findOrCreate);

//const User = new mongoose.model('User', userSchema);

module.exports = mongoose.model('PickUpGroup', pickUpGroupSchema);