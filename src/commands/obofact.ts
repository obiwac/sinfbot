import chalk from "chalk";
import { SlashCommandBuilder } from "discord.js";
import { request } from "undici";
import type { Command } from "../types";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("obofact")
		.setDescription(
			"Obo did amazing things. Shares a fact that our savior did"
		),

	execute: async interaction => {
		try {
			const { body } = await request(
				"https://api.chucknorris.io/jokes/random"
			);
			const fact: any = await body.json();
			const sent = fact.value.replaceAll("Chuck Norris", "Obo");

			return interaction.reply(sent);
		} catch (error) {
			console.error(
				`${chalk.redBright.bold("ERROR")} ${chalk.gray(
					">"
				)} (obofact) Error while fetching API: ${error}`
			);

			interaction.reply({
				content:
					":x: We couldn't fetch any Obo fact (the API is probably down or someone messed up)",
				ephemeral: true
			});

			setTimeout(() => interaction.deleteReply(), 5000);
		}
	}
};

export default command;
