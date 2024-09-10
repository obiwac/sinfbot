import chalk from "chalk";
import { SlashCommandBuilder } from "discord.js";
import { request } from "undici";

import type { Command } from "../types";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("pokémon")
		.setDescription("Find any Pokémon (why does this command even exist?)")
		.addIntegerOption(option =>
			option
				.setName("id")
				.setDescription("The ID of the Pokémon")
				.setMinValue(1)
				.setMaxValue(1025)
				.setRequired(true)
		),

	execute: async interaction => {
		try {
			const id = interaction.options.getInteger("id", true);

			const { body } = await request(
				`https://pokeapi.co/api/v2/pokemon/${id}`
			);
			const { sprites }: any = await body.json();

			interaction.reply(sprites["front_default"]);
		} catch (error) {
			console.error(
				`${chalk.redBright.bold("ERROR")} ${chalk.gray(
					">"
				)} (pokémon) Error while fetching API: ${error}`
			);

			interaction.reply({
				content:
					":x: We couldn't fetch any Pokémon (the API is probably down or someone messed up)",
				ephemeral: true
			});

			setTimeout(() => interaction.deleteReply(), 5000);
		}
	}
};

export default command;
