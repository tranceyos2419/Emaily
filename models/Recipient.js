// embeded subDocs
const mongoose = require('mongoose');
const { Schema } = mongoose;

// one mongo schema can have data up to 40 mb
const recipientSchema = new Schema({
    email: String,
    responded: {
        type: Boolean,
        default: false
    }
});

module.exports = recipientSchema;
