import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'

import Client from '../client'

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display the descriptions of all commands.')
    .setDMPermission(false),
  async execute(
    client: Client,
    interaction: CommandInteraction,
  ): Promise<void> {
    const cmds = client.getCommandsData()
    const cmdsDescriptions = cmds.map(cmd => {
      return `**Command Name**: \`/${cmd.name}\`\n**Description**: _${cmd.description}_`
    })

    const helpEmbed = new EmbedBuilder()
      .setTitle('Help')
      .setDescription(cmdsDescriptions.join('\n\n'))
      .setColor(0x0099ff)
    await interaction.reply({ embeds: [helpEmbed] })
  },
}
