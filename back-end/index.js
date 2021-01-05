const   // CORE EXPRESS
        express         = require("express"),
        app             = express(),
        // ROUTES
        userRoutes      = require("./routes/users"),
        uploadRoutes    = require("./routes/uploads"),
        // DATABASE
        db              = require("./models"),
        // CONFIG FILES
        CONFIG          = require("./config/config"),
        // EXTERNAL MODULES
        passport        = require("passport"),
        LocalStrategy   = require("passport-local").Strategy,
        bodyParser      = require("body-parser"),
        cookieSession   = require("cookie-session"),
        cors            = require("cors"),
        path            = require("path");


app.use(cookieSession({
    maxAge: CONFIG.SESSION.MAX_AGE,
    SameSite: CONFIG.SESSION.SAME_SITE,
    keys: CONFIG.SESSION.KEYS
}))

const corsOptions = {
    credentials: CONFIG.CORS.CREDENTIALS,
    allowedHeaders: CONFIG.CORS.ALLOWED_HEADERS,
    methods: CONFIG.CORS.METHODS,
    origin: CONFIG.CORS.ORIGIN_URLS
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json('application/json'));

app.use(passport.initialize());

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false
    },
    db.User.authenticate()
));

passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());

app.use("/api/user", userRoutes);
app.use("/api/upload", uploadRoutes);

app.get("api/*", (_, res) => {
    res.status(404).send("Url not found: 404");
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(CONFIG.PORT, () => {
    console.log("[RUN] Running on port " + CONFIG.PORT);
});