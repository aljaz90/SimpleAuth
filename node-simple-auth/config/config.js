module.exports = {
    PORT: 4000,
    DATABASE_URL: "mongodb://localhost:27017/",
    SESSION: {
        KEY_LENGTH: 64,
        LENGTH: 24,
        MAX_AGE: 1000 * 60 * 60 * 24,
        SAME_SITE: true,
        KEYS: ["thisisaverysecureandsecurekey"]
    },
    RESET_LINK: {
        KEY_LENGTH: 64,
        LENGTH: 900,
    },
    CORS: {
        ORIGIN_URLS: [
            'http://localhost:3000',
            'http://localhost:4000'
        ],
        METHODS: ['GET', 'POST', 'PUT', 'DELETE'],
        ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'Set-Cookie'],
        CREDENTIALS: true
    },
};