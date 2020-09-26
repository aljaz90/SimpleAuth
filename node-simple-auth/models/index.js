let mongoose    = require("mongoose"),
    config      = require("../config");

try {
    mongoose.connect( config.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
        console.log("Connected established to the database")
    );    
}
catch (err) { 
    console.log("Could not connect to the database:");    
    console.log(err);    
}


mongoose.Promise = Promise;

module.exports.Session = require("./session");
module.exports.User = require("./user");