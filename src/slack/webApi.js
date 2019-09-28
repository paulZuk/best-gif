const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_TOKEN;

class SlackWebClient {
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
    
    postMessage(channelName, message) {
        this.getChannelId(channelName)
            .then(id => {
                this.web.chat.postMessage({
                    channel: id,
                    text: message,
                });
            })
    };
}

module.exports = SlackWebClient;
