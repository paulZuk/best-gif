const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const slackEvents = require('./src/slack/events');
const MongoClient = require('./src/mongodb/client');
const checkMessageLink = require('./src/helper/isLink');

const port = process.env.PORT || 3000;
const app = express();

app.use('/slack/events', slackEvents.requestListener());
app.use(bodyParser());

const server = createServer(app);

slackEvents.on('message', event => {
    if(!checkMessageLink(event.text)) {
        return;
    }

    const preparedObject = {
        id: event.client_msg_id,
        text: event.text,
        user_id: event.user,
        channel_id: event.channel,
    };

    MongoClient.add('Messages', preparedObject);
});


server.listen(port, () => {
  console.log(`Listening for events on ${server.address().port}`);
});

console.log(MongoClient.getCollection('Messages'));