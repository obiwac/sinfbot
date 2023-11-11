import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { execSync } from 'child_process'

import Client from '../client'

export default {
  data: new SlashCommandBuilder()
    .setName('version')
    .setDescription('Return branch & commit hash the bot is running on')
    .setDMPermission(false),
  async execute(
    client: Client,
    interaction: CommandInteraction,
  ): Promise<void> {
    const commit = execSync('git rev-parse HEAD').toString().trim()
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    const remote = execSync('git config --get remote.origin.url')
      .toString()
      .trim()
    const system = execSync('uname -r').toString().trim()

    await interaction.reply({
      content: `Running on commit \`${commit}\`, branch \`${branch}\` (\`${remote}\`, ${system})`,
    })
  },
}
