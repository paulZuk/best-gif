const { createEventAdapter } = require('@slack/events-api');
const checkMessageLink = require('../helper/isLink');

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

const slackEvents = createEventAdapter(slackSigningSecret);

const setEventListenerPath = (app) => {
    app.use('/slack/events', slackEvents.requestListener());
}

const setMessageEvent = (db) => {
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
    
        db.add('messages', preparedObject);
    });
}

module.exports = {
    setEventListenerPath,
    setMessageEvent,
}