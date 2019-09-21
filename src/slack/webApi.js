const { WebClient } = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_TOKEN);

export const getUserID = () => {
    return web.auth.test()
        .then(response => response.user_id);
};

export const getChannelId = (channelName) => {
    return web.channels.list()
        .then(list => list.channels
            .find(elem => elem.name === channelName)
            .id
        );
}

export const postMessage = (channelName, message) => {
    getChannelId(channelName).then(id => {
        web.chat.postMessage({
            channel: id,
            text: message,
        });
    })
};

module.exports = {
    getUserID,
    getChannelId,
    postMessage,
}
