const { createEventAdapter } = require('@slack/events-api');
const checkMessageLink = require('../helper/isLink');

class SlackEvents {
    constructor(config) {
        this.slackEvents = createEventAdapter(config.signingSecret);        
    }
    setEventListenerPath(app) {
        app.use('/slack/events', this.slackEvents.requestListener());
    }
    
    setMessageEvent(db) {
        this.slackEvents.on('message', event => {

            if(!checkMessageLink(event.text)) {
                return;
            }
        
            const preparedObject = {
                id: event.client_msg_id,
                text: event.text,
                user_id: event.user,
                channel_id: event.channel,
                date: Date.now(),
                reactions: null,
                ts: event.ts,
            };
        
            db.add('messages', preparedObject);
        });
    }
    setReactionAddedEvent(db) {
        this.slackEvents.on('reaction_added', event => {
            const query = { ts: event.item.ts };

            db.find('messages', query, (res) => {
                console.log(res);
                
                if(!res.length) {
                    return;
                }

                const reactions = res[0].reactions + 1
                const newData = { $set: { reactions }};

                db.update('messages', query, newData);
            });
        });
    }
};

module.exports = SlackEvents;