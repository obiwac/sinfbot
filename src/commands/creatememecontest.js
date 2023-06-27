const {SlashCommandBuilder} = require("@discordjs/builders")
const fs = require('fs');
const {check_interaction_privilege} = require("../utils/require_privilege");
const {ChannelType} = require("discord-api-types/v9");
const {refresh_contests} = require("../utils/meme_contest");
const uuid = require("uuid")
require("dotenv").config({path: "../.env"})

const MEME_CONTEST_DIRECTORY = "../meme_contest/"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('creatememecontest')
        .setDescription('Meme contest creator')
        .addChannelOption(option => option
            .setName("contestchannel")
            .setDescription("Channel Where the contest will take place")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText))
        .addStringOption(option => option
            .setName("emoji")
            .setDescription("Custom emoji to use for reaction counting. Obtain it by typing \\:emotename: in a discord chat")
            .setRequired(true)),

    async execute(client, interaction) {
        check_interaction_privilege(interaction);

        const contestChannel = interaction.options.getChannel("contestchannel");
        const contestEmoji = interaction.options.getString("emoji");

        if (interaction.guild.emojis.cache.filter((e) => {
            return e.toString() === contestEmoji
        }).size <= 0) {
            return interaction.reply({
                content: "Error: contest reaction emoji must be from THIS server.",
                ephemeral: true
            })
        }

        if (!fs.existsSync(MEME_CONTEST_DIRECTORY)) {
            fs.mkdirSync(MEME_CONTEST_DIRECTORY);
        }

        let contest = {}
        const now = new Date().toISOString();

        contest["id"] = uuid.v4();
        contest["started"] = now;
        contest["ended"] = null;
        contest["contest_channel_id"] = contestChannel.id;
        contest["contest_reaction_id"] = contestEmoji;
        contest["contest_winner"] = null;
        contest["active"] = true;
        contest["posts"] = {};



        await client.channels.cache.get(contestChannel.id)
            .send("The meme master has now started... May the best win (@Lebelge don't even think about it).")
            .then(sent => {
                contest["start_message_id"] = sent.id;

                const data = JSON.stringify(contest);

                fs.writeFileSync(`${MEME_CONTEST_DIRECTORY}${contest["id"]}.json`, data, (e) => {
                    if (e) {
                        console.log(e);

                        return interaction.reply({content: `The following error occurred while writing to the file: ${e}. Please check the logs for further details.`})
                    }
                })

                refresh_contests();


                return interaction.reply({content: "Meme contest created", ephemeral: true});
            });

    },
}