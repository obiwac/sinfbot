import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  EmbedBuilder,
} from 'discord.js'

import Client from '../client'

export default {
  name: 'warn',
  async execute(client: Client, interaction: ButtonInteraction): Promise<void> {
    const confessInfo = interaction.customId.split('-')
    const confessMessage = interaction.channel!.messages.cache.get(
      confessInfo[1],
    )

    if (!confessMessage) {
      await interaction.reply({
        content: 'This confession was not found or has expired',
      })
      return
    }

    const disabledComponents = confessMessage.components.map(component => {
      const row = ActionRowBuilder.from(
        component as never,
      ) as ActionRowBuilder<ButtonBuilder>
      row.components.forEach(comp => {
        comp.setDisabled(true)
      })

      return row
    })

    await confessMessage.edit({
      content: '**Confession rejected and user warned.**',
      embeds: [...confessMessage.embeds],
      components: disabledComponents,
    })
    await interaction.reply({
      content: 'The confession was rejected and user warned!',
      ephemeral: true,
    })

    const user = await client.users.fetch(confessInfo[2]).catch()
    user
      ?.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('Confession rejected - Warning')
            .setDescription(
              `Your confession has been rejected and you have been issued a warning. Please note that confessions are **NOT** intended for this purpose. This includes (but not limited to): asking questions about courses (refer to the channel in question), sexual/violent/discriminating content, or stuff that crosses the line of being a bit too edgy. Please do help keep this a safe space :)`,
            )
            .setColor(0xffa500),
        ],
      })
      .catch()
  },
}
