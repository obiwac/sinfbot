const fs = require('fs')
const path = require('path')
const { Client, Collection, GatewayIntentBits } = require('discord.js')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
})

client.commands = new Collection()
const commandFiles = fs
  .readdirSync(path.join(__dirname, 'commands'))
  .filter(file => file.endsWith('.js'))
const eventFiles = fs
  .readdirSync(path.join(__dirname, 'events'))
  .filter(file => file.endsWith('.js'))

// Register the set of commands dynamically by reading the ./commands folder
for (const file of commandFiles) {
  const command = require(path.join(__dirname, `commands/${file}`))
  client.commands.set(command.data.name, command)
}

// Register the set of events dynamically by reading the ./events folder
for (const file of eventFiles) {
  const event = require(path.join(__dirname, `events/${file}`))

  if (event.once)
    client.once(event.name, (...args) => event.execute(client, ...args))
  else client.on(event.name, (...args) => event.execute(client, ...args))
}

client.login(process.env.DISCORD_TOKEN)
