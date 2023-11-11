import { EmbedBuilder, Events, MessageReaction, User } from 'discord.js'

import Client from '../client'

const ROLE_NAME = 'Pineur'
const VOTE_MINUTES = 20
const VOTE_THRESHOLD = 2
const VOTE_EXCLUDE_PINNER = true

const IN_FAVOUR_REACTION = '✅'
const AGAINST_REACTION = '❌'

const ICONS = {
  salute: 'https://cdn.discordapp.com/emojis/852922249442230292.png?size=96',
  waah: 'https://cdn.discordapp.com/emojis/852922249065660476.png?size=96',
}

export default {
  name: Events.MessageReactionAdd,
  once: false,
  async execute(
    client: Client,
    reaction: MessageReaction,
    user: User,
  ): Promise<void> {
    let isPin = false
    const title = reaction.message.embeds[0].title

    if (title?.includes('Pin vote')) {
      isPin = true
    } else if (title?.includes('Unpin vote')) {
      isPin = false
    } else return

    const messageId = reaction.message.embeds[0].footer?.text
    if (!messageId) {
      return
    }

    const messageAffect = await reaction.message.channel.messages
      .fetch(messageId)
      .catch()
    if (!messageAffect) {
      return
    }

    const message = reaction.message
    if (Date.now() - message.createdTimestamp > VOTE_MINUTES * 60 * 1000) {
      await message.reactions.removeAll()
      return
    }

    if (message.author?.id === user.id && VOTE_EXCLUDE_PINNER) {
      return
    }

    const member = reaction.message.guild!.members.cache.get(user.id)
    if (member?.roles.cache.some(r => r.name === ROLE_NAME)) {
      const reactEmbed = new EmbedBuilder()
        .setTitle(isPin ? 'Pin vote' : 'Unpin vote')
        .setDescription(
          `User with the ${ROLE_NAME} role (${user.tag}) voted to 
          ${isPin ? 'pin' : 'unpin'} the message! Message will now be 
          ${isPin ? 'pinned' : 'unpinned'}!`,
        )
        .setThumbnail(ICONS['salute'])
        .setColor(0x00ff00)
      await message.reply({ embeds: [reactEmbed] })
      await message.reactions.removeAll()
      isPin ? await messageAffect.pin() : await messageAffect.unpin()
      return
    }

    const emoji = reaction.emoji
    if (emoji.name === IN_FAVOUR_REACTION || emoji.name === AGAINST_REACTION) {
      const totalFavour = message.reactions.resolve(IN_FAVOUR_REACTION)?.count
      const totalAgainst = message.reactions.resolve(AGAINST_REACTION)?.count

      if (!totalFavour || !totalAgainst) {
        return
      }

      if (totalFavour - 1 >= VOTE_THRESHOLD) {
        if (
          totalAgainst >= totalFavour &&
          Date.now() - message.createdTimestamp > VOTE_MINUTES * 60 * 1000
        ) {
          const reactEmbed = new EmbedBuilder()
            .setTitle(isPin ? 'Pin vote' : 'Unpin vote')
            .setDescription(
              `More or the same number of people voted against the 
              ${isPin ? 'pin' : 'unpin'} as in favour of the 
              ${
                isPin ? 'pin' : 'unpin'
              } (${totalAgainst} vs ${totalFavour}). Message will not be 
              ${isPin ? 'pinned' : 'unpinned'}.`,
            )
            .setThumbnail(ICONS['waah'])
            .setColor(0xff0000)
          await message.reply({ embeds: [reactEmbed] })
          await message.reactions.removeAll()
          isPin ? await messageAffect.pin() : await messageAffect.unpin()
        } else if (totalFavour > totalAgainst) {
          const reactEmbed = new EmbedBuilder()
            .setTitle(isPin ? 'Pin vote' : 'Unpin vote')
            .setDescription(
              `Vote was successful! Message will now be ${
                isPin ? 'pinned' : 'unpinned'
              }!`,
            )
            .setThumbnail(ICONS['salute'])
            .setColor(0x00ff00)
          await message.reply({ embeds: [reactEmbed] })
          await message.reactions.removeAll()
          isPin ? await messageAffect.pin() : await messageAffect.unpin()
        }
      }
    }
  },
}
