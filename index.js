const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('hi there')
});

// if Heroku provides process.env.PORT, use it. if not, it is 5000
const PORT = process.env.PORT || 5000;

// express is asking to node to listen to port 5000
app.listen(5000);
