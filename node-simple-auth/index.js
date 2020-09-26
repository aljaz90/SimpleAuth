let express         = require("express"),
    app             = express(),
    userRoutes      = require("./routes/users"),
    db              = require("./models"),
    bodyParser      = require("body-parser"),
    cors            = require("cors"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local").Strategy,
    GoogleStrategy  = require('passport-google-oauth20').Strategy,
    path            = require('path'),
    cookieSession   = require("cookie-session"),
    keys            = require("./config/keys"),
    config          = require("./config");

app.use(cookieSession({
    maxAge: 1000 * 60 * 60 * 24,
    keys: [...keys.cookieKeys] 
}))

/*passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  (accessToken, refreshToken, profile, cb) => {
    db.User.findOrCreate({ googleId: profile.id }, (err, user) => {
      return cb(err, user);
    });
  }
));*/

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

app.use(passport.initialize());

passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        User.authenticate()
));

passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

app.use("/api/users", userRoutes);
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(4000, () => {
    console.log("Running on port " + 4000);
});