import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

import Client from '../client';

export default {
  data: new SlashCommandBuilder()
    .setName('obofact')
    .setDescription('Returns a Obo fact')
    .setDMPermission(false),
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    const url = 'https://api.chucknorris.io/jokes/random';
    const res = await fetch(url);

    if (!res.ok) {
      await interaction.reply({
        content: 'The obofact was not found.',
        ephemeral: true,
      });
      return;
    }

    const data = await res.json();
    await interaction.reply({
      content: data.value.replaceAll('Chuck Norris', 'Obo'),
    });
  },
};
