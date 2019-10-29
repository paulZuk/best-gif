const { WebClient } = require('@slack/web-api');

class SlackWeb {
    constructor(config) {
        this.web = new WebClient(config.token);
    }

    getUserID() {
        return this.web.auth.test()
            .then(response => response.user_id);
    };
    
    getChannelId(channelName) {
        return this.web.channels.list()
            .then(list => list.channels
                .find(elem => elem.name === channelName)
                .id
            );
    }
    
    postMessage(channelName, messageData) {
        this.getChannelId(channelName)
            .then(id => {
                this.web.chat.postMessage({
                    channel: id,
                    ...messageData,
                });
            })
    };
}

module.exports = SlackWeb;
