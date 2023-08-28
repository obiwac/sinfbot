const path = require('path')
const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
} = require('@discordjs/builders')
const { ButtonStyle, ComponentType } = require('discord.js')
require('dotenv').config({ path: path.join(__dirname, '../env') })

const VOTE_MINUTES = 60 * 24

module.exports = {
  data: new SlashCommandBuilder()
    .setName('confess')
    .setDescription(
      'Confess a sin to the entire world and feel the redemption growing inside you',
    )
    .addStringOption(option =>
      option
        .setName('sin')
        .setDescription('A sin to confess')
        .setRequired(true),
    )
    .addAttachmentOption(option =>
      option
        .setName('image')
        .setRequired(false)
        .setDescription('Attach an image with your confession !'),
    ),

  async execute(client, interaction) {
    const sin = interaction.options.getString('sin')
    let messageAttachment = interaction.options.getAttachment('image')
    const adminChannel = await client.channels.fetch(
      process.env.ADMIN_CHANNEL_ID,
    )
    const confessionChannel = await client.channels.fetch(
      process.env.CONFESSION_CHANNEL_ID,
    )

    const confessionEmbed = new EmbedBuilder()
      .setTitle('New confession')
      .setDescription(sin)
      .setColor(0x5865f2)

    const approveButton = new ButtonBuilder()
      .setCustomId('approve')
      .setLabel('Approve')
      .setStyle(ButtonStyle.Danger)

    const rejectButton = new ButtonBuilder()
      .setCustomId('reject')
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)

    const warnButton = new ButtonBuilder()
      .setCustomId('warn')
      .setLabel('Warn')
      .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder().addComponents(
      approveButton,
      rejectButton,
      warnButton,
    )

    if (messageAttachment !== null)
      confessionEmbed.setImage(messageAttachment.url)

    let vote = await adminChannel.send({
      embeds: [confessionEmbed],
      components: [row],
    })

    const collector = vote.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: VOTE_MINUTES * 60 * 1000,
    })

    collector.on('collect', async i => {
      collector.stop()
      i.deferUpdate() // Acknoledges the interaction without doing anything

      if (i.customId === 'approve') {
        await confessionChannel.send({ embeds: [confessionEmbed] })

        await vote.edit({
          embeds: [
            confessionEmbed
              .setTitle('Confession approved')
              .setDescription(sin)
              .setColor(0x00ff00),
          ],
          components: [],
        })

        await interaction.member
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle('Confession approved')
                .setDescription(
                  `Your confession "*${sin}*" was approved. It is now available publicly.`,
                )
                .setColor(0x00ff00),
            ],
          })
          .catch(() => undefined)
      } else if (i.customId === 'reject') {
        await vote.edit({
          embeds: [
            confessionEmbed
              .setTitle('Confession rejected')
              .setDescription(sin)
              .setColor(0xff0000),
          ],
          components: [],
        })

        await interaction.member
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle('Confession rejected')
                .setDescription(
                  `Your confession "*${sin}*" was rejected by God himself. Therefore, it will not be shared publicly.`,
                )
                .setColor(0xff0000),
            ],
          })
          .catch(() => undefined)
      } else {
        await vote.edit({
          embeds: [
            confessionEmbed
              .setTitle('Confession rejected and user warned')
              .setDescription(sin)
              .setColor(0xffa500),
          ],
          components: [],
        })

        await interaction.member
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle('WARNING')
                .setDescription(
                  `Your confession "*${sin}*" has been rejected and you have been issued a warning. Please note that confessions are **NOT** intended for this purpose. This includes (but not limited to): asking questions about courses (refer to the channel in question), sexual/violent/discriminating content, or stuff that crosses the line of being a bit too edgy. Please do help keep this a safe space :)`,
                )
                .setColor(0xffa500),
            ],
          })
          .catch(() => undefined)
      }
    })

    collector.on('end', async (_, reason) => {
      if (reason === 'time') {
        // Vote timed out
        await vote.edit({
          embeds: [
            confessionEmbed
              .setTitle('Vote timed out')
              .setDescription(sin)
              .setColor(0x808080),
          ],
          components: [],
        })

        await interaction.member
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle('Confession rejected')
                .setDescription(
                  `Your confession "*${sin}*" received no votes (God seems to be busy). It was therefore rejected. You can however resubmit it with the command /confess`,
                )
                .setColor(0x808080),
            ],
          })
          .catch(() => undefined)
      }
    })

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('Confession sent')
          .setDescription(
            "Your confession has been sent and is awaiting verification. If your DM's are open to everyone, you'll be notified when it has been approved or rejected.",
          )
          .setColor(0x5865f2),
      ],
      ephemeral: true,
    })
  },
}
