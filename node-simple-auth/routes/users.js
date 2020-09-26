let express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    db          = require("../models"),
    middleware  = require("../middleware"),
    helpers     = require("../helpers");
    
Date.prototype.addHours = function(hours) {
    this.setHours(this.getHours() + hours);
    return this;
}

router.get("/", middleware.isLoggedIn, (req, res) => {
    db.User.findById(req.user.id).populate("portfolios").exec((err, user) => {
        if (err) {
            return res.status(400).json(err);
        }
        res.json(user);
    });
})

router.post("/new", (req, res) => {
    let newUser = new db.User({email: req.body.email, username: req.body.first_name+" "+req.body.last_name});
    db.User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.json(err);
        } 

        passport.authenticate('local', {session: false}) (req, res, () => {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            let session = new db.Session({ip: ip, user: req.user._id, key: helpers.generateID(48)});
            session.save(err => {
                if (err) {
                    return res.status(400).json(err);
                }

                req.session.key = session.key;
                req.session.session = session._id;
                req.session.expiration = session.expire_at;

                res.json(user._doc);
            }); 
        });
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.clearCookie('connect.sid');

        req.session.expiration = null;
        req.session.session = null;
        req.session.key = null;

        if (err) {
            return res.send(err);
        }
        res.send("LOGGED OUT"); 
    });
});

router.post("/", passport.authenticate('local', { session: false }), (req, res) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let session = new db.Session({ip: ip, user: req.user._id, key: helpers.generateID(48)});
    session.save(err => {
        if (err) {
            return res.status(400).json(err);
        }

        req.session.key = session.key;
        req.session.session = session._id;
        req.session.expiration = session.expire_at;

        res.json(user._doc);
    });
});


router.post("/", passport.authenticate('local', { session: false }), (req, res) => {
    
});

module.exports = router;