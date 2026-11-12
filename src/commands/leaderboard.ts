import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

import Feur from "../db/models/feur";
import Blindtest from "../db/models/blindtest";
import type { Command } from "../types";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("See who's the feur master")
		.addSubcommand(subcommand =>
			subcommand.setName("feur").setDescription("get the feur leaderboard")
		)
		.addSubcommand(subcommand =>
			subcommand.setName("blindtest").setDescription("get the blindtest leaderboard")
		),
	execute: async interaction => {
		// feur case
		if (interaction.options.getSubcommand() === "feur"){

			const feurs = await Feur.findAll({
				where: {
					isAdmin: false
				},
				order: [["amount", "DESC"]],
				limit: 20
			});

			if (!feurs.length)
				return interaction.reply({
					content: ":x: No one has said feur yet!",
					flags: MessageFlags.Ephemeral
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
		}

		// blindtest case
		else if (interaction.options.getSubcommand() === "blindtest"){

			const blind = await Blindtest.findAll({
				order: [["score","DESC"]],
				limit: 20
			})

			if (!blind.length)
				return interaction.reply({
					content: ":x: We don't have a score for the blind test",
					flags: MessageFlags.Ephemeral
				});

			const embed = new EmbedBuilder()
				.setTitle("Blindtest Leaderboard")
				.setDescription(
					blind
						.map(
							(blind, index) =>
								`${
									index === 0
										? "🥇"
										: index === 1
											? "🥈"
											: index === 2
												? "🥉"
												: index + 1
								}. <@${blind.userId}> - ${blind.score}`
						)
						.join("\n")
				);

			interaction.reply({ embeds: [embed] });

		}
	},
	cooldown: 5
};

export default command;
