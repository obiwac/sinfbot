import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import Client from '../client';

export default {
  data: new SlashCommandBuilder().setName('poop').setDescription('Poop...').setDMPermission(false),
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    await interaction.reply({
      content: 'https://enes.gg/img/r/poop.gif',
    });
  },
};
