import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js'

import Client from '../client'

const ROLE_NAME = 'Pineur'
const VOTE_MINUTES = 20
const VOTE_THRESHOLD = 2

const IN_FAVOUR_REACTION = '✅'
const AGAINST_REACTION = '❌'

const ICONS = {
  angry: 'https://cdn.discordapp.com/emojis/852922248997896192.png?size=96',
}

export default {
  data: new SlashCommandBuilder()
    .setName('unpin')
    .setDescription('Allows non-administrators to unpin messages')
    .addStringOption(option =>
      option
        .setName('id')
        .setDescription('ID of the message you want to unpin')
        .setRequired(true),
    ),
  async execute(
    client: Client,
    interaction: CommandInteraction,
  ): Promise<void> {
    const id = interaction.options.get('id')?.value as string
    const message = await interaction.channel!.messages.fetch(id)

    if (!message) {
      await interaction.reply({
        content:
          "Message could not be found! Are you sure you're passing a valid message ID?",
        ephemeral: true,
      })
      return
    }

    if (!message.pinned) {
      await interaction.reply({
        content: "Message isn't pinned!",
        ephemeral: true,
      })
      return
    }

    const member = interaction.member as GuildMember
    if (member.roles.cache.some(r => r.name == ROLE_NAME)) {
      await message.unpin()
      await interaction.reply({
        content: 'Message has been unpinned!',
        ephemeral: true,
      })
      return
    }

    const unpinMessage = new EmbedBuilder()
      .setTitle('Unpin vote')
      .setDescription(
        `${interaction.user.tag} has insufficient privileges to unpin this message! We will now proceed to a vote! After ${VOTE_MINUTES} minutes, if there are at least ${VOTE_THRESHOLD} votes in favour of this unpin and there are more people in favour than against it, your message will be unpinned!`,
      )
      .setThumbnail(ICONS['angry'])
      .setFooter({ text: `Message ID: ${id}` })
      .setColor(0x5865f2)
    await message.reply({ embeds: [unpinMessage] }).then(m => {
      m.react(IN_FAVOUR_REACTION)
      m.react(AGAINST_REACTION)
    })

    await interaction.reply({
      content: 'Insufficient privileges to unpin this message!',
      ephemeral: true,
    })
  },
}
