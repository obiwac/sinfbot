const fs = require("fs");

const MEME_CONTEST_DIRECTORY = "../meme_contest/"

function check_ongoing_contests() {
    let activeContests = [];
    var files = fs.readdirSync(MEME_CONTEST_DIRECTORY);

    for (const file of files) {
        if (file === "example_contest.jsonc") {
            continue;
        }

        let contest = JSON.parse(fs.readFileSync(`${MEME_CONTEST_DIRECTORY}${file}`))

        if (contest.active === true) {
            activeContests.push({
                filename: file, channelId: contest.contest_channel_id
            })
        }
    }

    return activeContests;
}

let activeContests = [];

function get_contest(filename) {
    return JSON.parse(fs.readFileSync(`${MEME_CONTEST_DIRECTORY}${filename}`))
}

module.exports = {
    get_active_contests: () => activeContests,
    refresh_contests: () => activeContests = check_ongoing_contests(),
    get_contest
}