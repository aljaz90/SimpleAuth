let middlewareObj   = {},
    db              = require("../models");

middlewareObj.isLoggedIn = async (req, res, next) => {
    
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const key = req.session.key;
    const session = req.session.session;
    const expiration = req.session.expiration;

    if (key && session && expiration && new Date(expiration) > new Date()) {
        try {
            let foundSession = await db.Session.findOne({key: key, ip: ip}).populate("user");
            if (foundSession && foundSession._id.equals(session)) {
                req.user = foundSession.user;

                let timeToExpiration = (new Date(expiration).getTime() - new Date().getTime()) / 1000;
                if (timeToExpiration < 60*60*2) {
                    try {
                        foundSession.updated_at = new Date();
                        foundSession.expire_at = new Date().addHours(24);
                        let savedSession = await foundSession.save();
                        req.session.expiration = savedSession.expire_at;                    
                    }
                    catch (err) {
                        console.log("Unable to extend session");
                        console.log(err);
                    }
                }

                return next();
            }
            else {
                console.log("Invalid session")
                return res.status(401).json("Unauthorized");
            }
        }
        catch (err) {
            console.log("ERR")
            console.log(err);
            return res.status(401).json("Unauthorized");
        }
    } 
    else {
        req.session.expiratikeyon = null;
        req.session.session = null;
        req.session.expiration = null;
        console.log("Damaged session")

        res.status(401).json("Unauthorized");
    }
};

module.exports = middlewareObj;