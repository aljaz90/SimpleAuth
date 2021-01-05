const mongoose = require("mongoose"),
      CONFIG   = require("../config/config");      

(async () => {
    try {
        await mongoose.connect(CONFIG.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`[CONNECTED] Connected to the database at: ${CONFIG.DATABASE_URL}`);
    }
    catch (err) { 
        console.log(`[ERROR] Unable to connect to the database at: ${CONFIG.DATABASE_URL}`);
        console.log(err)  
    }
})();

mongoose.Promise = Promise;
mongoose.set('useCreateIndex', true);

module.exports.Session = require("./session");
module.exports.User = require("./user");
module.exports.Upload = require("./upload");
module.exports.PasswordResetLink = require("./password_reset_link");