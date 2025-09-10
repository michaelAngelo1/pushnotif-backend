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

// Test push notif
let savedSubscription = null;

app.post('/proxy/subscribe', (req, res) => {
    savedSubscription = req.body;
    console.log("Subscription received");

    res.status(201).json({
        message: "Subscription received message"
    })
});

// Endpoint for notification
app.post('/send-notification', (req, res) => {

    if(!savedSubscription) {
        return res.status(404).json({
            error: "No subscription found to test"
        })
    }

    const payload = JSON.stringify({
        title: "Test Notification", 
        body: "It works!",
    });

    webpush.sendNotification(savedSubscription, payload)
        .then(() => {
            res.status(201).json({
                message: "Notification sent successfully"
            })
        })
        .catch((err) => {
            console.log("Error sending notification");
            res.status(500);
        })
});

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

module.exports = app