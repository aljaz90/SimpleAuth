let express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    db          = require("../models"),
    middleware  = require("../middleware"),
    ExtractJwt  = require('passport-jwt').ExtractJwt,
    jwt         = require('jsonwebtoken');
    
Date.prototype.addHours = function(hours) {
    this.setHours(this.getHours() + hours);
    return this;
}

let cookieExtractor = req => {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
};

router.get("/", middleware.isLoggedIn, (req, res) => {
    db.User.findById(req.user.id).populate("portfolios").exec((err, user) => {
        if (err) {
            return res.status(400).json(err);
        }
        res.json(user);
    });
})

router.post("/new", (req, res) => {
    let newUser = new db.User({email: req.body.email, first_name: req.body.first_name, last_name: req.body.last_name});
    db.User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.json(err);
        } 
        else {
            passport.authenticate('local', {session: false}) (req, res, () => {
                const token = jwt.sign({ userId: user.id }, 'thisisasecret...');
                const tokenExpiration = new Date().addHours(24);
                res.json({user, token, tokenExpiration});
            });
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.clearCookie('connect.sid');
        if (err) {
            return res.send(err);
        }
        res.send("LOGGED OUT"); 
    });
});

router.post("/", passport.authenticate('local', { session: false }), (req, res) => {
    db.User.findById(req.user.id).populate("portfolios").exec((err, user) => {
        if (err) {
            return res.status(400).json(err);
        }
        const token = jwt.sign({ userId: user.id }, 'thisisasecret...');
        const tokenExpiration = new Date().addHours(24);
        res.json({user, token, tokenExpiration});
    });
});

module.exports = router;