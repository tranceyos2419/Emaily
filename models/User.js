//the size of each document on mongoDB is 4mb
const mongoose = require('mongoose');
const { Schema } = mongoose;

// defining new schema
const userSchema = new Schema({
    googleId: String,
    credits: { type: Number, default: 0 }
});

// loading a schema to mongoose
mongoose.model('users', userSchema);
