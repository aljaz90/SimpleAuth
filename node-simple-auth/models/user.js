let mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");


let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "First Name cannot be blank"
    },
    email: {
        type: String,
        required: "Email cannot be blank"
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
module.exports = mongoose.model("User", userSchema);