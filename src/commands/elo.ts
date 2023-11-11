import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'

import Client from '../client'

export default {
  data: new SlashCommandBuilder()
    .setName('elo')
    .setDescription('Get elo with the user specified on chess.com')
    .addStringOption(option =>
      option
        .setName('username')
        .setDescription('Username of the user on chess.com')
        .setRequired(true),
    )
    .setDMPermission(false),
  async execute(
    client: Client,
    interaction: CommandInteraction,
  ): Promise<void> {
    const username = interaction.options.get('username')?.value as string

    const url = `https://api.chess.com/pub/player/${username.toLowerCase()}/stats`
    const res = await fetch(url)

    if (!res.ok) {
      await interaction.reply({
        content: 'The player was not found.',
        ephemeral: true,
      })
      return
    }

    const data = await res.json()
    const { chess_bullet, chess_blitz, chess_rapid } = data
    const eloEmbed = new EmbedBuilder()
      .setTitle('elo')
      .setDescription(username)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL()!,
      })
      .addFields(
        {
          name: 'bullet',
          value: chess_bullet
            ? chess_bullet['last']['rating'].toString()
            : 'Pas classé',
          inline: true,
        },
        {
          name: 'blitz',
          value: chess_blitz
            ? chess_blitz['last']['rating'].toString()
            : 'Pas classé',
          inline: true,
        },
        {
          name: 'rapide',
          value: chess_rapid
            ? chess_rapid['last']['rating'].toString()
            : 'Pas classé',
          inline: true,
        },
      )
      .setColor(0x0099ff)
      .setThumbnail(
        'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png',
      )
    await interaction.reply({ embeds: [eloEmbed] })
  },
}
