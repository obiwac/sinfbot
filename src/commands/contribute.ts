import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

import type { Command } from "../types";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("contribute")
		.setDescription("Links to the GitHub repository"),

	execute: interaction => {
		const embed = new EmbedBuilder()
			.setTitle("Contribute to SinfBot!")
			.setDescription(
				"Check out the GitHub repository [here](https://github.com/obiwac/sinfbot)"
			)
			.setThumbnail(
				"https://images.emojiterra.com/twitter/v13.1/512px/1f517.png"
			);

		interaction.reply({ embeds: [embed] });
	}
};

export default command;
