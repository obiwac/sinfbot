const https = require('https')
const { EmbedBuilder, SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('elo')
    .setDescription('Get elo with the user specified on chess.com')
    .addStringOption(option =>
      option
        .setName('username')
        .setDescription('Username of the user on chess.com')
        .setRequired(true),
    ),

  async execute(_, interaction) {
    let username = interaction.options.getString('username')
    username = username.toLowerCase()

    const options = {
      hostname: 'api.chess.com',
      path: `/pub/player/${username}/stats`,
      method: 'GET',
    }

    const getRating = categoryInformation =>
      categoryInformation !== undefined
        ? `${categoryInformation['last']['rating']}`
        : 'pas classé'

    const req = https.request(options, res => {
      let data = ''
      if (res.statusCode === 200) {
        res.on('data', d => {
          data += d
        })

        res.on('end', () => {
          const player = JSON.parse(data)
          const { chess_bullet, chess_blitz, chess_rapid } = player
          const embed = new EmbedBuilder()
            .setTitle('elo')
            .setDescription(username)
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.avatarURL(),
            })
            .setColor(0x0099ff)
            .setThumbnail(
              'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png',
            )
            .addFields(
              {
                name: 'bullet',
                value: getRating(chess_bullet).toString(),
                inline: true,
              },
              {
                name: 'blitz',
                value: getRating(chess_blitz).toString(),
                inline: true,
              },
              {
                name: 'rapide',
                value: getRating(chess_rapid).toString(),
                inline: true,
              },
            )
          interaction.reply({ embeds: [embed] })
        })
      } else if (res.statusCode === 404) {
        const embed = new EmbedBuilder()
          .setTitle('Erreur')
          .setDescription(`${username} pas trouvé sur chess.com`)
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL(),
          })
          .setColor(0xff1919)
          .setThumbnail(
            'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png',
          )
        interaction.reply({ embeds: [embed], ephemeral: true })
      } else {
        const embed = new EmbedBuilder()
          .setTitle('Erreur')
          .setDescription(`Erreur lors de la recherche des ratings`)
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL(),
          })
          .setColor(0xff1919)
          .setThumbnail(
            'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png',
          )
        interaction.reply({ embeds: [embed], ephemeral: true })
      }
    })

    req.on('error', _ => {
      const embed = new EmbedBuilder()
        .setTitle('Erreur')
        .setDescription(`Il y a eu une erreur lors de la recherche.`)
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL(),
        })
        .setColor(0xff1919)
        .setThumbnail(
          'https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png',
        )
      interaction.reply({ embeds: [embed], ephemeral: true })
    })

    req.end()
  },
}
