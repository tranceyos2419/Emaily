const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');
const mongoose = require('mongoose');
const isLoggedIn = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const surveyTemplate = require('../services/emailTemplate/surveyTemplate');

const Mailer = require('../services/Mailer');
const Survey = mongoose.model('surveys');

module.exports = app => {
    app.get('/api/surveys', isLoggedIn, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id })
            .select({ // stop referring an embedded schema
                recipients: false
            })
        res.send(surveys);
    })

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting');
    })

    // for testing getting e-mail from SendGrid
    //! this route does not work
    app.post('/api/surveys/webhooks', (req, res) => {
        //! use mongo query syntax (so that I don't need to bring out data to express)
        _.chain(req.body)
            .map(event => {
                // console.log('url ' + event.url);
                const pathname = new URL(event.url).pathname;
                const p = Path.createPath('/api/surveys/:surveyId/:choice')
                const match = p.test(pathname);
                if (match) {
                    return {
                        email: event.email,
                        surveyId: match.surveyId,
                        choice: match.choice
                    }
                }
            })
            .compact() // remove undefined or null from an object
            .uniqBy('email', 'surveyId')//remove duplicated elements with 'email' and 'surveyId' properties
            .each(({ surveyId, email, choice }) => {
                Survey.updateOne({
                    _id: surveyId,
                    recipients: {
                        $elemMatch: { email: email, responded: false }
                    }
                }, {
                        $inc: { [choice]: 1 },
                        $set: { 'recipients.$.responded': true },
                        lastResponded: new Date()
                    }).exec() // gotta execute what I set
            })
        // .value()
        console.log(req.body);
        res.send({})
    })

    app.post('/api/surveys', isLoggedIn, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            //title: title
            title,
            subject,
            body,
            // .map(email => { return {email:email}})
            // .map(email => ({ email })),
            recipients: recipients.split(',')
                .map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSent: Date.now()
        })
        // first argument: subject and recipients
        // second argument: body
        const mailer = new Mailer(survey, surveyTemplate(survey));

        // for catching every errors that might occur in try, I write try and catch
        try {
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();
            console.log(user);
            res.send(user);
        } catch (err) {
            res.status(422).send(err);
        }

    })
}
