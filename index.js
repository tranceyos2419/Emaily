//! the order of code is really important in this file
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');

// not returning anything, I want to just execute this
require('./models/User');
require('./models/Survey');
// passport requires loading User.js first
require('./services/passport');

const keys = require('./config/keys')

const app = express();
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
})

//! app.use middlewares work to every single requests
// I can apply a middleware to every single requests by writing
// app.use(require('route/to/middleware'))
// req.body is available because of bodyParser
app.use(bodyParser.json());
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
require('./routes/billingRoutes')(app);
require('./routes/surveyRoute')(app);

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js file, or main.css file
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    //? how is react handling /surveys route in production mode?
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

// if Heroku provides process.env.PORT, use it. if not, it is 5000
const PORT = process.env.PORT || 5000;

// express is asking to node to listen to port 5000
app.listen(PORT);
