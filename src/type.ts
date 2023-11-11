import { SlashCommandBuilder, CommandInteraction, ButtonInteraction } from 'discord.js';

import Client from './client';

export type Command = {
  readonly data: SlashCommandBuilder;
  execute(client: Client, interaction: CommandInteraction): Promise<void>;
};

export type Button = {
  readonly name: string;
  execute(client: Client, interaction: ButtonInteraction): Promise<void>;
};
