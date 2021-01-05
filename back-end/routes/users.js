const   express     = require("express"),
        router      = express.Router(),
        passport    = require("passport"),
        db          = require("../models"),
        middleware  = require("../middleware"),
        helpers     = require("../helpers"),
        CONFIG      = require("../config/config");
    
Date.prototype.addHours = function(hours) {
    this.setHours(this.getHours() + hours);
    return this;
};

router.get("/", middleware.isLoggedIn, async (req, res) => {
    try {
        const userData = {user: req.user._doc};
        res.json(userData);
    }
    catch (err) {
        console.log("[ERROR] An error occured while getting user data");
        console.log(err);
        res.status(400).send("An error occured while getting user data");
    }
});

router.put("/", middleware.isLoggedIn, async (req, res) => {
    try {
        // Getting data from permitter fields
        const permittedFields = ["email", "image_url", "country", "city", "completed_tutorial", "name"];
        let newUserData =  {};
        for (let field of permittedFields) {
            if (req.body[field] !== undefined) {
                newUserData[field] = req.body[field];
            }
        }

        // Updating permitted fields
        await db.User.updateOne({ _id: req.user._id }, {$set: newUserData});
        res.json({...req.user._doc, ...newUserData});
    }
    catch (err) {
        console.log("[ERROR] An error occured while updating user");
        console.log(err);
        res.status(400).send("An error occured while updating user");
    }
});

router.post("/new", async (req, res) => {
    try {
        if (!req.body.password || req.body.password.length < 6) {
            throw "Password is too short";
        }

        let newUser = new db.User({email: req.body.email, country: req.body.country, name: req.body.name, city: req.body.city, image_url: req.body.image_url});
        await db.User.register(newUser, req.body.password);
        passport.authenticate('local', {session: false}) (req, res, async () => {
            try {
                const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                const userAgent = req.headers['user-agent'];
                let session = new db.Session({ip: ip, user: req.user._id, key: helpers.generateID(CONFIG.SESSION.KEY_LENGTH), user_agent: userAgent});
                await session.save(); 
                req.session.key = session.key;
                req.session.session = session._id;
                req.session.expiration = session.expire_at;

                const userData = { user: req.user._doc };
                res.json(userData);
            }
            catch (err) {
                console.log("[ERROR] An error occured while authenticating new user");
                console.log(err);
                res.status(400).send("An error occured while authenticating new user");
            }    
        });
    }
    catch (err) {
        console.log("[ERROR] An error occured while creating a user");
        console.log(err);
        res.status(400).send("An error occured while creating a user");
    }
});

router.get('/logout', async (req, res) => {
    try {
        await db.Session.findByIdAndDelete(req.session.session);
    }
    catch (err) {
        console.log("[ERROR] An error occured while deleting session");
        console.log(err);
    }

    req.session = null;
    res.end();
});

router.post("/", passport.authenticate('local', { session: false }), async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        
        let session = new db.Session({ip: ip, user: req.user._id, key: helpers.generateID(CONFIG.SESSION.KEY_LENGTH), user_agent: userAgent});
        await session.save();
        req.session.key = session.key;
        req.session.session = session._id;
        req.session.expiration = session.expire_at;

        const userData = { user: user._doc };
        res.json(userData);
    }
    catch (err) {
        console.log("[ERROR] An error occured while authenticating an existing user");
        console.log(err);
        res.status(400).send("An error occured while authenticating an existing user");
    }
});

router.post("/password-reset/generate", async (req, res) => {
    try {
        let user = await db.User.findOne({email: req.body.email});
        if (!user) {
            throw `Document not found: User {email: ${req.body.email}}`;
        }

        let activeResetLink = await db.PasswordResetLink.findOne({user: user._id});
        if (activeResetLink) {
            throw "Password reset link already generated";
        }

        let resetLink = new db.PasswordResetLink({user: user._id, key: helpers.generateID(CONFIG.RESET_LINK.KEY_LENGTH)});
        await resetLink.save();
        // TODO: SEND EMAIL TO USER WITH THE LINK
        res.send("Success");
    }
    catch (err) {
        console.log("[ERROR] An error occured while trying to generate a password reset link");
        console.log(err);
        res.status(400).send("An error occured while generating a password reset link");
    }
});

router.post("/password-reset/reset", async (req, res) => {
    try {
        let passwordLink = await db.PasswordResetLink.findOne({key: req.body.key}).populate("user");
        if (!passwordLink) {
            throw `Document not found: PasswordResetLink {key: ${req.body.key}}`;
        }

        if (!req.body.password || req.body.password.length < 6) {
            throw "Password is too short";
        }

        await passwordLink.user.setPassword(req.body.password);
        await passwordLink.user.save();
        await db.PasswordResetLink.findOneAndDelete({key: req.body.key});

        res.send("Success");
    }
    catch (err) {
        console.log("[ERROR] An error occured while changing password");
        console.log(err);
        res.status(400).send("An error occured while changing password");
    }
});

router.post("/password-change", middleware.isLoggedIn, passport.authenticate('local', { session: false }), async (req, res) => {
    try {
        if (!req.body.newPassword || req.body.newPassword.length < 6) {
            throw "Password is too short";
        }

        await req.user.setPassword(req.body.newPassword);
        await req.user.save();
        
        res.send("Success");
    }
    catch (err) {
        console.log("[ERROR] An error occured while changing password");
        console.log(err);
        res.status(400).send("An error occured while changing password");
    }
});

module.exports = router;