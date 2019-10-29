const {
    createServer
} = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const SlackEvents = require('./src/slack/events');
const SlackWeb = require('./src/slack/webApi');
const MongoClient = require('./src/mongodb/client');

const token = process.env.SLACK_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const app = express();

const mongodb = new MongoClient();

const slackWeb = new SlackWeb({
    token
});
const slackEvents = new SlackEvents({
    signingSecret,
    dbClient: mongodb,
    app,
});

const port = process.env.PORT || 3000;

slackEvents.setEventListenerPath();
slackEvents.setReactionAddedEvent();
slackEvents.setMessageEvent();

app.use(bodyParser());

const server = createServer(app);

mongodb.init((db) => {
    app.locals.db = db;

    console.log('Database connected');
    server.listen(port, () => {
        console.log(`Listening for events on ${server.address().port}`);
    });

    // db.collection('messages').drop();
    db.collection('messages').find().toArray((err, res) => {
        console.log(res);
    });

    const message = {
        text: 'https://9gag.com/gag/aN00MoK',
        // username: 'Best gif bot',
        // as_user: true,

        // unfurl_links: true,
        // unfurl_media: true,
        // parse: 'full',
    }

    // slackWeb.postMessage('best-gif', message);
});