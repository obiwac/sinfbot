import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'

import Client from '../client'

export default {
  data: new SlashCommandBuilder()
    .setName('pokémon')
    .setDescription('Returns the image of a pokémon')
    .addIntegerOption(option =>
      option.setName('id').setDescription('Pokémon id').setRequired(true),
    )
    .setDMPermission(false),
  async execute(
    client: Client,
    interaction: CommandInteraction,
  ): Promise<void> {
    const id = interaction.options.get('id')?.value as number

    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`
    const res = await fetch(url)

    if (!res.ok) {
      await interaction.reply({
        content: 'The pokemon was not found.',
        ephemeral: true,
      })
      return
    }

    const data = await res.json()
    const pokemonEmbed = new EmbedBuilder()
      .setImage(data.sprites['front_default'])
      .setColor(0x5865f2)
    await interaction.reply({ embeds: [pokemonEmbed] })
  },
}
