const checkMessageLink = (message) => {
    const isLink = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const regex = new RegExp(isLink);

    return message.match(regex);
}

module.exports = checkMessageLink;