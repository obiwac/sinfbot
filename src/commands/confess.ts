import {
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  GuildTextBasedChannel,
} from 'discord.js'

import Client from '../client'

export default {
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
    )
    .setDMPermission(false),
  async execute(
    client: Client,
    interaction: CommandInteraction,
  ): Promise<void> {
    const sin = interaction.options.get('sin')?.value as string
    const image = interaction.options.get('image')?.attachment

    const adminChannel = (await client.channels.fetch(
      process.env.ADMIN_CHANNEL_ID!,
    )) as GuildTextBasedChannel

    const confessEmbed = new EmbedBuilder()
      .setTitle('Confession')
      .setDescription(sin)
      .setColor(0x5865f2)
    if (image) {
      confessEmbed.setImage(image.url)
    }

    adminChannel.send({ embeds: [confessEmbed] }).then(message => {
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
          .setCustomId(`approve-${message.id}-${interaction.user.id}`)
          .setLabel('Approve')
          .setStyle(ButtonStyle.Success)
          .setEmoji({ name: '✅' }),
        new ButtonBuilder()
          .setCustomId(`reject-${message.id}-${interaction.user.id}`)
          .setLabel('Reject')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji({ name: '❌' }),
        new ButtonBuilder()
          .setCustomId(`warn-${message.id}-${interaction.user.id}`)
          .setLabel('Warn')
          .setStyle(ButtonStyle.Danger)
          .setEmoji({ name: '⚠️' }),
      ])

      message.edit({ components: [row] })
    })

    const confirmConfess = new EmbedBuilder()
      .setTitle('Confession sent')
      .setDescription(
        "Your confession has been sent and is awaiting verification. If your DM's are open to everyone, you'll be notified when it has been approved or rejected.",
      )
      .setColor(0x5865f2)
    await interaction.reply({ embeds: [confirmConfess], ephemeral: true })
  },
}
