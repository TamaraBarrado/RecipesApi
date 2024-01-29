const routes = require('./routes/routes');
const express = require('express');
const fs = require('fs')
const https = require('https')
const cors = require("cors");
const port = 3000;
const bodyParser = require('body-parser');
const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

const server = https.createServer({
    cert: fs.readFileSync('/etc/letsencrypt/live/tamarabarrado.es/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/tamarabarrado.es/privkey.pem')
}, app).listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Remote Server listening on port ${server.address().port}`);
});