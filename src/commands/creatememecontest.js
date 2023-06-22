const {SlashCommandBuilder} = require("@discordjs/builders")
const fs = require('fs');
const {check_interaction_privilege} = require("../utils/require_privilege");
require("dotenv").config({path: "../.env"})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('creatememecontest')
        .setDescription('Meme contest creator'),

    async execute(client, interaction) {
        check_interaction_privilege(interaction);

        return interaction.reply({content: "Meme contest created (NOT FUNCTIONAL YET)", ephemeral: true})
    },
}