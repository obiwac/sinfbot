const {get_active_contests, get_contest} = require("../utils/meme_contest");

module.exports = {
    name: "messageCreate",
    execute(client, message) {
        let activeContests = get_active_contests();

        for (const contest of activeContests) {
            if (contest.channelId === message.channelId) {
                let contestContent = get_contest(contest.id)
                message.react(contestContent.contest_reaction_id)
            }
        }
    }
}