const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

// not returning anything, I want to just execute this
require('./models/User');
// passport requires loading User.js first
require('./services/passport');

const keys = require('./config/keys')

const app = express();
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
})

// app.use is a middleware
app.use(
    // populating incoming request to a session
    cookieSession({
        // expire date is 30 days
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
)

app.use(passport.initialize())
// passport is accessing to the session which cookieSession created
app.use(passport.session())


// const authRoutes = require('./routes/authRoutes');
// authRoutes(app);
require('./routes/authRoutes')(app);

// if Heroku provides process.env.PORT, use it. if not, it is 5000
const PORT = process.env.PORT || 5000;

// express is asking to node to listen to port 5000
app.listen(PORT);
