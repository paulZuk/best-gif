const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const SlackEvents = require('./src/slack/events');
const SlackWeb = require('./src/slack/webApi');
const MongoClient = require('./src/mongodb/client');

const token = process.env.SLACK_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const slackWeb = new SlackWeb({ token });
const slackEvents = new SlackEvents({ signingSecret });

const port = process.env.PORT || 3000;
const app = express();

const mongodb = new MongoClient();

slackEvents.setEventListenerPath(app);
app.use(bodyParser());

const server = createServer(app);

mongodb.init((db) => {
    app.locals.db = db;

    console.log('Database connected');
    server.listen(port, () => {
        console.log(`Listening for events on ${server.address().port}`);
    });

    slackEvents.setReactionAddedEvent(mongodb);
    slackEvents.setMessageEvent(mongodb);

    db.collection('messages').find().toArray((err, res) => {
        console.log(res);
    });
});
