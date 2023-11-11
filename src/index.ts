import { ClientEvents, GatewayIntentBits } from 'discord.js'
import { readdirSync } from 'fs'
import path from 'path'

import dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, '.env') })

import Client from './client'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
})

readdirSync(path.join(__dirname, 'commands'))
  .filter(file => file.endsWith('.js'))
  .forEach(async file => {
    const { default: cmd } = await import(`./commands/${file}`)
    client.setCommand(cmd)
  })

readdirSync(path.join(__dirname, 'buttons'))
  .filter(file => file.endsWith('.js'))
  .forEach(async file => {
    const { default: btn } = await import(`./buttons/${file}`)
    client.setButton(btn)
  })

readdirSync(path.join(__dirname, 'events'))
  .filter(file => file.endsWith('.js'))
  .forEach(async file => {
    const { default: event } = await import(`./events/${file}`)

    if (event.once) {
      client.once(event.name, (...args: ClientEvents[]) => {
        return event.execute(client, ...args)
      })
    } else {
      client.on(event.name, (...args: ClientEvents[]) => {
        return event.execute(client, ...args)
      })
    }
  })

client.login(process.env.DISCORD_TOKEN)
