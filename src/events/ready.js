const {refresh_contests, get_active_contests} = require("../utils/meme_contest");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {

        refresh_contests();
        const contests = get_active_contests();

        let toSend = "## 🤖 Beep boop I just woke up. 🤖 \n";

        if (contests.length > 0) {
            toSend = toSend.concat(`There is/are ${contests.length} active meme contest(s). \n`);
            let count = 1;

            for (const contest of contests) {
                toSend = toSend.concat(`${count} : ${contest["id"]} \n`);
                count = count + 1;
            }
        }

        console.log(toSend)
        // client.channels.cache.get(process.env.LOG_CHANNEL_ID).send(toSend);
        console.log("ready")
    },
}
