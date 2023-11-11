import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import Client from '../client';

export default {
  data: new SlashCommandBuilder()
    .setName('bible')
    .setDescription('Returns a passage from the bible')
    .addStringOption(option =>
      option.setName('book_name').setDescription('Book Name').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('chapter').setDescription('Chapter Number').setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('verse').setDescription('Verse Number').setRequired(true)
    )
    .setDMPermission(false),
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    const book = interaction.options.get('book_name')?.value as string;
    const chapter = interaction.options.get('chapter')?.value as number;
    const verse = interaction.options.get('verse')?.value as number;

    const url = `https://bible-api.com/${book}+${chapter}:${verse}`;
    const res = await fetch(url);

    if (!res.ok) {
      await interaction.reply({
        content: 'The text was not found.',
        ephemeral: true,
      });
      return;
    }

    const data = await res.json();
    const bibleEmbed = new EmbedBuilder()
      .setTitle(data.reference)
      .setDescription(data.text)
      .setFooter({ text: data.translation_name })
      .setColor(0x5865f2);
    await interaction.reply({ embeds: [bibleEmbed] });
  },
};
