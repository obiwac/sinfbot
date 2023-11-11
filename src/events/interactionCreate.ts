import { ChannelType, Events, Interaction } from 'discord.js'

import Client from '../client'
import { Button, Command } from '../type'

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(client: Client, interaction: Interaction): Promise<void> {
    if (
      interaction.channel?.type == ChannelType.DM ||
      interaction.guild == null ||
      interaction.channel == null
    ) {
      await interaction.user.send({
        content: 'DM commands are not allowed!',
      })
      return
    }

    if (interaction.isCommand()) {
      const cmd: Command | undefined = client.getCommand(
        interaction.commandName,
      )
      if (!cmd) {
        interaction.reply({
          content: 'Unknown command!',
          ephemeral: true,
        })
        return
      }

      await cmd.execute(client, interaction)
      return
    }

    if (interaction.isButton()) {
      const btnName = interaction.customId.split('-')[0]
      const btn: Button | undefined = client.getButton(btnName)
      if (!btn) {
        interaction.reply({
          content: 'Unknown button!',
          ephemeral: true,
        })
        return
      }

      await btn.execute(client, interaction)
    }
  },
}
