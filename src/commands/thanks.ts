import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'
import { execSync } from 'child_process'

import Client from '../client'

export default {
  data: new SlashCommandBuilder()
    .setName('thanks')
    .setDescription('Return the list of my contributors')
    .setDMPermission(false),
  async execute(
    client: Client,
    interaction: CommandInteraction,
  ): Promise<void> {
    const contributors = execSync(
      "git shortlog -sne HEAD | awk '!_[$NF]++' | awk '{$1=$NF=\"\"}1' | awk '{$1=$1}1'",
    ).toString()

    const embed = new EmbedBuilder()
      .setTitle('Thanks')
      .setDescription(contributors)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL()!,
      })
      .setThumbnail(
        'https://images.emojiterra.com/twitter/v13.1/512px/1f44f.png',
      )
      .setColor(0x5865f2)

    await interaction.reply({ embeds: [embed] })
  },
}
