import {
  CommandInteraction,
  GuildMember,
  GuildTextBasedChannel,
  PermissionsBitField,
  SlashCommandBuilder,
} from 'discord.js';

import Client from '../client';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Prune up to 99 messages.')
    .addIntegerOption(option =>
      option.setName('amount').setDescription('Number of messages to prune').setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
    .setDMPermission(false),
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    const member = interaction.member as GuildMember;

    if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      await interaction.reply({
        content: "You don't have the permission to do that.",
        ephemeral: true,
      });
      return;
    }

    const amount = interaction.options.get('amount')!.value as number;
    if (amount < 1 || amount >= 100) {
      await interaction.reply({
        content: 'You need to input a number between 0 and 99.',
        ephemeral: true,
      });
      return;
    }

    await (interaction.channel as GuildTextBasedChannel).bulkDelete(amount, true).catch(error => {
      console.error(error);
      interaction.reply({
        content: 'There was an error trying to prune messages in this channel!',
        ephemeral: true,
      });
    });

    await interaction.reply({
      content: `Successfully pruned **${amount}** messages.`,
      ephemeral: true,
    });
  },
};
