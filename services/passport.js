const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const keys = require('../config/keys');

// loading User.js in index.js first
const User = mongoose.model('users');

// user is coming from done(error, user) in passport.use
//! passport automatically pass user info to cookie-session
// callback of passport.use ->   serializeUser   -> cookie-session(session) -> cookies
//      profile             ->   serialize info  -> encode info -> cookies
passport.serializeUser((user, done) => {
    done(null, user.id);
})

//   cookies    -> cookie-session ->      passport   -> passport-deserializer -> req.user
// encoded code -> decoded code   -> serialized info -> deserialized info     -> req.user
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
})

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
},
    async (accessToken, refreshToken, profile, done) => {
        // when we reach out mongoDB, the action returns a promise(asynchronous)
        const existingUser = await User.findOne({ googleId: profile.id })
        if (existingUser) {
            // the 1st argument is error, the second one is user info
            // return means stopping a process there
            return done(null, existingUser)
        }
        // making model instance and saving as a record
        const user = await new User({ googleId: profile.id }).save()
        done(null, user)
    }));
