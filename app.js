require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); // <-- 1. Import the File System module

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

// 2. Read the service worker file into memory at startup
const swContent = fs.readFileSync(path.join(__dirname, 'service-worker.js'), 'utf8');

// ... (Your /proxy/subscribe and /send-notification routes go here) ...
let savedSubscription = null;
app.post('/proxy/subscribe', (req, res) => {
    savedSubscription = req.body;
    console.log("Subscription received");
    res.status(201).json({ message: "Subscription received message" });
});
app.post('/send-notification', (req, res) => {
    if (!savedSubscription) {
        return res.status(404).json({ error: "No subscription found to test" });
    }
    const payload = JSON.stringify({ title: "Test Notification", body: "It works!" });
    webpush.sendNotification(savedSubscription, payload)
        .then(() => res.status(201).json({ message: "Notification sent successfully" }))
        .catch((err) => {
            console.log("Error sending notification");
            res.sendStatus(500);
        });
});


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello, this is the Push Notification Server');
});

// 3. Update the route to use res.send()
app.get('/proxy/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Service-Worker-Allowed', '/');
    res.send(swContent); // <-- Use res.send() with the file content
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app;