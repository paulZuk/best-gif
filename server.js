const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const slackEvents = require('./src/slack/events');
const MongoClient = require('./src/mongodb/client');

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
})

slackEvents.setMessageEvent(mongodb);
