// Name convention
// First letter is capital: not exporting anything
// Firlst letter is lower-case: exporting something

const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
    constructor({ subject, recipients }, content) {
        super();

        this.sgApi = sendgrid(keys.sendGridKey);
        this.from_email = new helper.Email('no-replay@email.com');
        this.subject = subject;
        this.body = new helper.Content('text/html', content);
        this.recipients = this.formatAddresses(recipients);

        // this.addContent comes from Mail class as an build-in function
        this.addContent(this.body);
        this.addClickTracking();
        this.addRecipients();
    }

    formatAddresses(recipients) {
        // I need curly braces when I use short-hand of extraction
        return recipients.map(({ email }) => {
            return new helper.Email(email);
        })
    }

    addClickTracking() {
        //! There is not so much explanation for this function
        const trackingSettings = new helper.TrackingSettings();
        const clickTracking = new helper.ClickTracking(true, true);

        trackingSettings.setClickTracking(clickTracking);
        // this one comes from Mail class
        this.addTrackingSettings(trackingSettings);
    }

    addRecipients() {
        const personalize = new helper.Personalization();

        this.recipients.forEach(recipient => {
            personalize.addTo(recipient);
        })
        // this.addPersonalization comes from Mail class
        this.addPersonalization(personalize)
    }

    // sending email to SendGrid
    async send() {
        const request = this.sgApi.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            // this.toJSON comes from helper.Mail
            body: this.toJSON()
        });
        const response = await this.sgApi.API(request);
        return response
    }

}

module.exports = Mailer;
