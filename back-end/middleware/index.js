const middlewareObj   = {},
      db              = require("../models");

middlewareObj.isLoggedIn = async (req, res, next) => {    
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //const userAgent = req.headers['user-agent'];
    const key = req.session.key;
    const session = req.session.session;
    const expiration = req.session.expiration;
    
    if (key && session && expiration && new Date(expiration) > new Date()) {
        try {
            let foundSession = await db.Session.findOne({key: key}).populate("user");
            if (foundSession && foundSession._id.equals(session) /*&& foundSession.ip === ip*/) {
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
                        console.log("[ERROR] An error occured while extending the session");
                        console.log(err);
                    }
                }

                return next();
            }
            else {
                console.log("[ERROR] An error occured while trying to find the session");
                
                if (foundSession) {
                    console.log("Session key and id do not match provided");
                    console.log(`Expected key: ${foundSession.key}; Expected session id: ${foundSession._id}; Expected ip: ${foundSession.ip}`);
                    console.log(`Given key: ${key}; Given session id: ${session}; Given ip: ${ip}`);
                }
                else {
                    console.log("404: Session not found");
                }

                return res.status(401).json("Unauthorized");
            }
        }
        catch (err) {
            console.log("[ERROR] An error occured while trying to find the session")
            console.log(err);
            return res.status(401).json("Unauthorized");
        }
    } 
    else {
        req.session = null;
        res.status(401).json("Unauthorized");
    }
};

module.exports = middlewareObj;