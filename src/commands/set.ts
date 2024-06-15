import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("set")
		.setDescription("Set a environment variable")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option =>
			option
				.setName("key")
				.setDescription("The key of the environment variable")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("value")
				.setDescription("The value of the environment variable")
				.setRequired(true)
		),

	execute: interaction => {
		const key = interaction.options.getString("key", true);
		const value = interaction.options.getString("value", true);

		process.env[key] = value;

		interaction.reply({
			content: `:white_check_mark: Set environment variable \`${key}\` to \`${value}\``,
			ephemeral: true
		});
	}
};

export default command;
