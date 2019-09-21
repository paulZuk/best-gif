const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const slackEvents = require('./src/slack/events');
const port = process.env.PORT || 3000;

const app = express();

app.use('/slack/events', slackEvents.requestListener());
app.use(bodyParser());

const server = createServer(app);

slackEvents.on('message', event => {
    console.log(event);
});

server.listen(port, () => {
  console.log(`Listening for events on ${server.address().port}`);
});