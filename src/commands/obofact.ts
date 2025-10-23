import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { request } from "undici";

import type { Command } from "../types";
import { getLogger } from "../logger";

const logger = getLogger("obofact");

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
			logger.error({ error }, "Could not fetch API");

			interaction.reply({
				content:
					":x: We couldn't fetch any Obo fact (the API is probably down or someone messed up)",
				flags: MessageFlags.Ephemeral
			});

			setTimeout(() => interaction.deleteReply(), 5000);
		}
	},

	cooldown: 5
};

export default command;
