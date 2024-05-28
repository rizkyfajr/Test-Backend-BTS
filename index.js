const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

require('dotenv').config({ path: require('find-config')('.env') });


const app = express();
app.use(bodyParser.json());

app.use('/', routes);

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Hello! Please Sign Up or Sign In to continue.')
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});