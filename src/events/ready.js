const {refresh_contests} = require("../utils/meme_contest");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {

        refresh_contests();

        // client.channels.cache.get(process.env.LOG_CHANNEL_ID).send("Beep boop I just woke up.")
        console.log("ready")
    },
}
