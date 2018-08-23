const mongoose = require('mongoose');
const { Schema } = mongoose;

// defining new schema
const userSchema = new Schema({
    googleId: String
});

// loading a schema to mongoose
mongoose.model('users', userSchema);
