import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { request } from "undici";

import type { Command } from "../types";
import { getLogger } from "../logger";

const logger = getLogger("bible");

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("bible")
		.setDescription("Return a passage from the bible"),

	execute: async interaction => {
		try {
			const { body } = await request(
				`https://bible-api.com/?random=verse`
			);
			const verse: any = await body.json();
			let sent = verse.text
				.replaceAll("God", "Obo")
				.replaceAll("Jesus", "JMH");

			interaction.reply(sent);
		} catch (error) {
			logger.error({ error }, "Could not fetch API");

			interaction.reply({
				content:
					":x: We couldn't fetch any verse (the API is probably down or someone messed up)",
				flags: MessageFlags.Ephemeral
			});

			setTimeout(() => interaction.deleteReply(), 5000);
		}
	},

	cooldown: 5
};

export default command;
