import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  EmbedBuilder,
  GuildTextBasedChannel,
} from 'discord.js';

import Client from '../client';

export default {
  name: 'approve',
  async execute(client: Client, interaction: ButtonInteraction): Promise<void> {
    const confessChannel = (await client.channels.fetch(
      process.env.CONFESSION_CHANNEL_ID!
    )) as GuildTextBasedChannel;

    const confessInfo = interaction.customId.split('-');
    const confessMessage = interaction.channel!.messages.cache.get(confessInfo[1]);

    if (!confessMessage) {
      await interaction.reply({ content: 'This confession was not found or has expired' });
      return;
    }

    const disabledComponents = confessMessage.components.map(component => {
      const row = ActionRowBuilder.from(component as never) as ActionRowBuilder<ButtonBuilder>;
      row.components.forEach(comp => {
        comp.setDisabled(true);
      });

      return row;
    });

    await confessChannel.send({ embeds: [...confessMessage.embeds] });
    await confessMessage.edit({
      content: '**Confession approved.**',
      embeds: [...confessMessage.embeds],
      components: disabledComponents,
    });
    await interaction.reply({ content: 'The confession was approved!', ephemeral: true });

    const user = await client.users.fetch(confessInfo[2]).catch();
    user
      ?.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('Confession approved')
            .setDescription(`Your confession was approved. It is now available publicly.`)
            .setColor(0x00ff00),
        ],
      })
      .catch();
  },
};
