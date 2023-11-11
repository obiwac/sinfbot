import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import Client from '../client';

export default {
  data: new SlashCommandBuilder()
    .setName('criminel')
    .setDescription('Criminel!')
    .setDMPermission(false),
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      content:
        'https://media.discordapp.net/attachments/636295672861032448/890574900346097684/unknown.png',
    });
  },
};
