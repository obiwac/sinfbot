const {SlashCommandBuilder} = require("@discordjs/builders")
const fs = require('fs');
const {check_interaction_privilege} = require("../utils/require_privilege");
const {ChannelType} = require("discord-api-types/v9");
require("dotenv").config({path: "../.env"})

const MEME_CONTEST_DIRECTORY = "../meme_constest/"

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
            .setDescription("Custom emoji to use for reaction counting")
            .setRequired(true)),

    async execute(client, interaction) {
        check_interaction_privilege(interaction);

        const contestChannel = interaction.options.getChannel("contestchannel");
        const contestEmoji = interaction.options.getString("emoji");

        if (!fs.existsSync(MEME_CONTEST_DIRECTORY)) {
            fs.mkdirSync(MEME_CONTEST_DIRECTORY);
        }


        return interaction.reply({content: "Meme contest created (NOT FUNCTIONAL YET)", ephemeral: true});
    },
}