import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

import Feur from "../db/models/feur";
import Blindtest from "../db/models/blindtest";
import type { Command } from "../types";

function generateEmbed(title: string, data: (Feur|Blindtest)[]){
	const str = title === "Feur" ? " feur(s)" : "";
	const embed = new EmbedBuilder()
		.setTitle(`${title} Leaderboard`)
		.setDescription(data
							.map(
								(element,index) =>
									`${
										index === 0 ? "🥇" :
										index === 1 ? "🥈" :
										index === 2 ? "🥉" :
										index + 1
									}. <@${element.userId}> - ${element instanceof Feur? element.amount: element.score} ${str}`
							).join("\n")
		);
	return embed
}

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

			interaction.reply({ embeds: [generateEmbed("Feur",feurs)] });
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

			interaction.reply({ embeds: [generateEmbed("Blindtest", blind)] });

		}
	},
	cooldown: 5
};

export default command;
