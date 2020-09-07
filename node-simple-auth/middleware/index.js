let middlewareObj   = {},
    db              = require("../models"),
    jwt             = require('jsonwebtoken'),
    passport        = require('passport');

middlewareObj.isLoggedIn = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token) {
        let decoded = jwt.verify(token, 'thisisasecret...', (err, decoded) => {
            if (err) {
                console.log(err);
                return;
            } 

            db.User.findById(decoded.userId, (err, user) => {
                if (err) {
                    return console.log(err);
                }
                req.user = user;
                return next();
            });
        });
    } else if(req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json("Not Authorised");
        res.redi
    }
};

module.exports = middlewareObj;