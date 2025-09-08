require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
    'mailto:michael.angelo@rocketindo.com',
    publicVapidKey,
    privateVapidKey
);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello, this is the Push Notification Server');
});

// Serves service-worker file
app.get('/proxy/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'service-worker.js'));
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

export default app;