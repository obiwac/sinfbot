const {SlashCommandBuilder} = require("@discordjs/builders")
const {get_contest} = require("../utils/meme_contest");
require("dotenv").config({path: "../.env"});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('refreshmemecontest')
        .setDescription('Refreshes the score for the meme contest specified in argument')
        .addStringOption(option => (option)
            .setName("contestid")
            .setDescription("ID of the contest to be refreshed")
        ),

    async execute(client, interaction) {
        let contest = get_contest(interaction.options.getString("contestid"));

        let memes = await client.channels.cache.get(contest.contest_channel_id).messages.fetch({after: contest.start_message_id})

        //console.log(memes)

        for (const message of memes) {
            if (message[1].author.bot === true) {
                continue;
            }

            let contest_reactions = message[1].reactions.cache.filter((react) => {
                return react._emoji.toString() === contest.contest_reaction_id;
            })

            if(contest_reactions.size <= 0) {
                continue;
            }

            console.log(message[1].reactions)

        }

        return interaction.reply({content: `Refreshed ${contest.id}`, ephemeral:true});
    },
}