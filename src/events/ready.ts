import { ActivityType, Events } from 'discord.js'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'

import Client from '../client'

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client): Promise<void> {
    await new REST({ version: '10' })
      .setToken(client.token!)
      .put(Routes.applicationCommands(client.application!.id), {
        body: client.getCommandsData(),
      })
      .then(() => console.info('Successfully registered application commands.'))
      .catch(console.error)

    client.user!.setActivity({
      name: 'SINF Bot - /help',
      type: ActivityType.Watching,
    })

    console.log(
      `The bot was successfully logged in as ${client.user!.username}`,
    )
  },
}
