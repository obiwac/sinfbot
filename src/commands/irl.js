const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('irl')
    .setDescription('Des admins sans autorité irl'),

  async execute(_, interaction) {
    return interaction.reply(
      'Au début quand j\'ai join ce serveur ca avait l\'air sympa mais au final j\'ai juste l\'impression d\'avoir un serveur ou des admins qui ont aucune autorité irl font chier juste parce qu\'ils peuvent et parce qu\'ils ont rien de mieux a faire dans la vie,vous étonnez pas que personne d\'autre parle sur le serv a part les delegues,admins ou d\'autres mecs randoms.J\'attends juste le moment ou les admins changeront en esperant qu\'ils soit pas comme les anciens',
    )
  },
}
