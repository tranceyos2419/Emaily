const passport = require('passport');

module.exports = (app) => {
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }))

    app.get('/auth/google/callback', passport.authenticate('google'));

    app.get('/api/logout', (req, res) => {
        // before being passed to passport-deserializer
        // res.send(req.session)
        req.logout();
        res.send(req.user);
    })

    app.get('/api/current_user', (req, res) => {
        // cookie-session ->      passport   -> passport-deserializer -> req.user
        // encoded coe    -> serialized info -> deserialized info     -> req.user
        res.send(req.user);
    })
}
