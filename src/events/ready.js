const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')
const path = require('path')

module.exports = {
  name: 'ready', // Triggered when the bot is ready, e.g. connected to Discord's socket
  once: true,

  async execute(client) {
    console.log(`The bot was successfully logged in as ${client.user.tag}!`)
    loadCommands()
  },
}

function loadCommands() {
  const commands = []
  const commandFiles = fs
    .readdirSync(path.join(__dirname, '../commands'))
    .filter(file => file.endsWith('.js'))
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

  for (const file of commandFiles) {
    if (file.startsWith('.')) continue

    const command = require(path.join(__dirname, `../commands/${file}`))
    commands.push(command.data.toJSON())
  }

  rest
    .put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      {
        body: commands,
      },
    )
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error)
}
