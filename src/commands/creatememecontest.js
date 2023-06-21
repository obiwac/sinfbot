const {SlashCommandBuilder} = require("@discordjs/builders")
require("dotenv").config({path: "../.env"})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('creatememecontest')
        .setDescription('Meme contest creator'),

    async execute(client, interaction) {
        const moderatorRole = process.env.MOD_ROLE_ID
        const adminRole = process.env.ADMIN_ROLE_ID
        console.log(moderatorRole)

        if (!interaction.member.roles.cache.has(moderatorRole) || !interaction.member.roles.cache.has(adminRole)) {
            return interaction.reply({
                content: "You do not have the permissions required to use this command",
                ephemeral: true
            })
        }
        return interaction.reply({content: "Meme contest created (NOT FUNCTIONAL YET)", ephemeral: true})
    },
}