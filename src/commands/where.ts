import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import type { Command } from "../types";
import localisations from "../data/map_data.json";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("where")
		.setDescription(
			"Get the location of any building/auditorium in Louvain-la-Neuve"
		)
		.addStringOption(option =>
			option
				.setName("search")
				.setDescription("The building/auditorium you want to locate")
				.setAutocomplete(true)
				.setRequired(true)
		),

	execute: interaction => {
		const url = "https://maps.google.com/?q=";
		const choice = interaction.options.getString("search", true);
		const data = localisations.find(
			item => item.name.toLowerCase() === choice.toLowerCase()
		);

		if (!data)
			return interaction.reply({
				content:
					":x: No element matched your search, try again (you *must* select an element in the list)",
				ephemeral: true
			});

		const embed = new EmbedBuilder()
			.setTitle(data.name)
			.setDescription(
				`[Click here](${url}${data.latitude},${data.longitude}) to see the location on Google Maps`
			);

		if (data.description)
			embed.addFields({ name: "Description", value: data.description });

		interaction.reply({ embeds: [embed] });
	},

	autocomplete: async interaction => {
		const focusedValue = interaction.options.getFocused();
		const choices = localisations.map(item => item.name);
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
