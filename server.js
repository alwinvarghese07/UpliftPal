const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());  // Enable CORS for all requests

// Dialogflow setup
const projectId = 'upliftpal-bot-bgef';
const sessionId = uuid.v4();
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: 'upliftpal-bot-bgef-66af808e4579.json'  // Update with the correct path to your JSON key file
});

app.post('/send-message', async (req, res) => {
    const message = req.body.message;

    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: 'en-US',
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        res.json({
            reply: result.fulfillmentText
        });
    } catch (error) {
        console.error('ERROR:', error);
        res.status(500).send('Error communicating with Dialogflow');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
