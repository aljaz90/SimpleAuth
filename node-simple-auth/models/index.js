let mongoose = require("mongoose");
mongoose.connect("server", { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });

mongoose.Promise = Promise;

module.exports.User = require("./user");