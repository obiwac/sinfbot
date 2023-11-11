import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

import Client from '../client';

export default {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a poll')
    .addStringOption(option =>
      option.setName('question').setDescription('Poll question').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('answers').setDescription('Possible poll answers').setRequired(false)
    )
    .setDMPermission(false),
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    const question = interaction.options.get('question')?.value as string;
    const answers = (interaction.options.get('answers')?.value as string)
      ?.split(' ')
      ?.map(value => value.replaceAll('_', ' '));

    if (!question) {
      await interaction.reply({
        content: 'You must provide a value for the question option',
        ephemeral: true,
      });
      return;
    }

    if (answers?.length == 1) {
      await interaction.reply({
        content: 'A poll may not have a single possible answer',
        ephemeral: true,
      });
      return;
    }

    const answerEmojis = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

    if (answers?.length > answerEmojis.length) {
      await interaction.reply({
        content: `You may not have more than ${answerEmojis.length} possible answers (you passed ${answers.length})`,
        ephemeral: true,
      });
      return;
    }

    let pollContent;
    if (answers) {
      pollContent = answers.map((answer, index) => {
        return `${answerEmojis[index]} ${answer}\n`;
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(question)
      .setDescription(
        pollContent == undefined || pollContent.length < 0 ? null : pollContent.join(' ')
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL()!,
      })
      .setColor(0x5865f2)
      .setThumbnail('https://cdn.discordapp.com/emojis/770002495614877738.png?size=44');
    await interaction.reply({ embeds: [embed] }).then(interactionRes => {
      interactionRes.fetch().then(async message => {
        if (!answers) {
          await message.react('✅');
          await message.react('❌');
        } else {
          answerEmojis.forEach(emoji => message.react(emoji));
        }
      });
    });
  },
};
