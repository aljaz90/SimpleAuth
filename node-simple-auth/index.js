let express = require("express"),
    app             = express(),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local").Strategy,
    //userRoutes      = require("./routes/users"),
    //db              = require("./models"),
    bodyParser      = require("body-parser"),
    //User            = db.User,
    cors            = require("cors"),
    JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt,
    path = require('path');



app.use(require("express-session")({
    secret: "isthisasecretpassphrase",
    resave: false,
    saveUninitialized: false
}));


let corsOptions = {
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: [
        'http://localhost:3000',
        'http://localhost:4000' 
    ]
}

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json('application/json'));

/*app.use(passport.initialize());

passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        User.authenticate()
    ));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'thisisasecret...'}, (jwtPayload, cb) => {

        return User.findById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));

app.use("/api/users", userRoutes);
*/

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(4000, () => {
    console.log("Running on port " + 4000);
});