import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import Feur from "../db/models/feur";
import type { Command } from "../types";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("See who's the feur master"),
	execute: async interaction => {
		const feurs = await Feur.findAll({
			where: {
				isAdmin: false
			},
			order: [["amount", "DESC"]],
			limit: 10
		});

		if (!feurs.length)
			return interaction.reply({
				content: ":x: No one has said feur yet!",
				ephemeral: true
			});

		const embed = new EmbedBuilder()
			.setTitle("Feur Leaderboard")
			.setDescription(
				feurs
					.map(
						(feur, index) =>
							`${
								index === 0
									? "🥇"
									: index === 1
									? "🥈"
									: index === 2
									? "🥉"
									: index + 1
							}. <@${feur.userId}> - ${feur.amount - 1} feur(s)`
					)
					.join("\n")
			);

		interaction.reply({ embeds: [embed] });
	},
	cooldown: 5
};

export default command;
