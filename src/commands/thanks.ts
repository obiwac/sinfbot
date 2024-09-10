import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

import type { Command } from "../types";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("thanks")
		.setDescription("Return the list of SinfBot's contributors"),

	execute: interaction => {
		let contributors = Bun.spawnSync([
			"git",
			"shortlog",
			"-s",
			"-n",
			"--all",
			"--no-merges"
		]).stdout.toString();

		contributors = contributors
			.split("\n")
			.map(line => line.trim())
			.map(line => {
				const [count, ...nameParts] = line.split(/\s+/);
				const name = nameParts.join(" ");

				return `${name} (${count} contributions)`;
			})
			.join("\n");

		const embed = new EmbedBuilder()
			.setTitle("Thanks")
			.setDescription(contributors)
			.setThumbnail(
				"https://images.emojiterra.com/twitter/v13.1/512px/1f44f.png"
			);

		interaction.reply({ embeds: [embed] });
	}
};

export default command;
