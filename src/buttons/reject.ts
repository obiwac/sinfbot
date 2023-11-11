import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  EmbedBuilder,
} from 'discord.js'

import Client from '../client'

export default {
  name: 'reject',
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
      content: '**Confession rejected.**',
      embeds: [...confessMessage.embeds],
      components: disabledComponents,
    })
    await interaction.reply({
      content: 'The confession was rejected!',
      ephemeral: true,
    })

    const user = await client.users.fetch(confessInfo[2]).catch()
    user
      ?.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('Confession rejected')
            .setDescription(
              `Your confession was rejected by God himself. Therefore, it will not be shared publicly.`,
            )
            .setColor(0xff0000),
        ],
      })
      .catch()
  },
}
