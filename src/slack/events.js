const {
    createEventAdapter
} = require('@slack/events-api');
const checkMessageLink = require('../helper/isLink');

const isBotMessage = event => event.subtype === 'bot_message';

class SlackEvents {
    constructor(config) {
        this.slackEvents = createEventAdapter(config.signingSecret);
        this.dbClient = config.dbClient;
        this.app = config.app;
    }
    
    setEventListenerPath() {
        this.app.use('/slack/events', this.slackEvents.requestListener());
    }

    setMessageEvent() {
        this.slackEvents.on('message', event => {

            console.log(event);

            this.addLinkMessage(event);
            this.addFileMessage(event);
        });
    }

    addFileMessage(event) {
        if (event.subtype !== 'file_share' ||
            isBotMessage(event)) {
            return;
        }

        const files = event.files[0];

        const preparedObject = {
            id: event.client_msg_id,
            text: files.url_private,
            user_id: event.user,
            channel_id: event.channel,
            reactions: null,
            ts: event.ts,
        }
        this.dbClient.add('messages', preparedObject);
    }

    addLinkMessage(event) {
        if (!checkMessageLink(event.text) ||
            isBotMessage(event)) {
            return;
        }

        const preparedObject = {
            id: event.client_msg_id,
            text: event.text,
            user_id: event.user,
            channel_id: event.channel,
            reactions: null,
            ts: event.ts,
        };

        this.dbClient.add('messages', preparedObject);
    }

    setReactionAddedEvent(db) {
        this.slackEvents.on('reaction_added', event => {
            const query = {
                ts: event.item.ts
            };

            db.find('messages', query, (res) => {
                console.log(res);

                if (!res.length) {
                    return;
                }

                const reactions = res[0].reactions + 1
                const newData = {
                    $set: {
                        reactions
                    }
                };

                db.update('messages', query, newData);
            });
        });
    }
};

module.exports = SlackEvents;