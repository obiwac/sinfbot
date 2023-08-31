module.exports = {
  name: 'interactionCreate', // Triggered when someone interacts with the bot
  once: false,

  async execute(client, interaction) {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command)
      return interaction.reply({ content: 'Unknown command!', ephemeral: true })

    try {
      console.log(command)
      await command.execute(client, interaction)
    } catch (err) {
      console.error(err)
      return interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  },
}
