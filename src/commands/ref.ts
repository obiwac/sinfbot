import { SlashCommandBuilder } from "discord.js";

import type { Command } from "../types";
import refs from "../data/refs.json";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("ref")
		.setDescription(
			"Send a wholesome video or a meme of your favorite teacher"
		)
		.addStringOption(option =>
			option
				.setName("search")
				.setDescription("The video/meme you want to send")
				.setAutocomplete(true)
				.setRequired(true)
		),

	execute: interaction => {
		const choice = interaction.options.getString("search", true);
		const data = refs.find(
			item => item.name.toLowerCase() === choice.toLowerCase()
		);

		if (!data)
			return interaction.reply({
				content:
					":x: No element matched your search, try again (you *must* select an element in the list)",
				ephemeral: true
			});

		interaction.reply(data.text);
	},

	autocomplete: async interaction => {
		const focusedValue = interaction.options.getFocused();
		const choices = refs.map(item => item.name);
		const filtered = choices
			.filter(choice =>
				choice.toLowerCase().includes(focusedValue.toLowerCase())
			)
			.slice(0, 25); // Discord limits the number of choices to 25

		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice }))
		);
	}
};

export default command;
