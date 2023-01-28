const {SlashCommandBuilder} = require('@discordjs/builders')
const {MessageEmbed} = require('discord.js')

const IN_FAVOUR_REACTION = '✅'
const AGAINST_REACTION = '❌'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription(
            'Suggest something to the administration team'
        )
        .addStringOption(option =>
            option
                .setName('suggestion')
                .setDescription('a suggestion to make')
                .setRequired(true),
        ),

    async execute(client, interaction) {
        const suggestion = interaction.options.getString('suggestion');
        const suggestionChannel = await client.channels.fetch(process.env.SUGGESTION_CHANNEL_ID);

        let suggestionEmbed = new MessageEmbed()
            .setTitle(`Nouvelle suggestion (${interaction.user.id})`)
            .setDescription(suggestion)
            .setColor('BLURPLE');

        let vote = await suggestionChannel.send({embed: suggestionEmbed});

        vote.react(IN_FAVOUR_REACTION);
        vote.react(AGAINST_REACTION);
    }
}