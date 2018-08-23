const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const mongoose = require('mongoose');
const keys = require('../config/keys');

// loading User.js in index.js first
const User = mongoose.model('users');

// user is coming from done(error, user) in passport.use
passport.serializeUser((user, done) => {
    done(null, user.id);
})

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
}, (accessToken, refreshToken, profile, done) => {
    // when we reach out mongoDB, the action returns a promise(asynchronous)
    User.findOne({ googleId: profile.id })
        .then((existingUser) => {
            if (existingUser) {
                // the 1st argument is error, the second one is user info
                done(null, existingUser)
            } else {
                // making model instance and saving as a record
                new User({ googleId: profile.id })
                    .save()
                    .then(user => {
                        done(null, user);
                    })
            }
        })
}));
