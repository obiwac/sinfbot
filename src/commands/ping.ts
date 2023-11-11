import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import Client from '../client';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .setDMPermission(false),
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    await interaction.reply({ content: 'Pong!' });
  },
};
