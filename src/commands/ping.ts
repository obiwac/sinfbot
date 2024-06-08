import { SlashCommandBuilder } from "discord.js";

import type { Command } from "../types";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Displays the bot's ping"),

	execute: interaction => {
		interaction.reply(`:ping_pong: ${interaction.client.ws.ping} ms`);
	},

	cooldown: 10
};

export default command;
