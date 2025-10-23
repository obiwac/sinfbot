import { Events, MessageFlags, type Interaction } from "discord.js";

import { getLogger } from "../logger";
import type { Event } from "../types";

const logger = getLogger("interactionCreate");

const event: Event = {
	name: Events.InteractionCreate,
	execute: (interaction: Interaction) => {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(
				interaction.commandName
			);
			const cooldown = interaction.client.cooldowns.get(
				`${interaction.commandName}-${interaction.user.username}`
			);

			if (!command) return;
			if (command.cooldown && cooldown) {
				if (Date.now() < cooldown) {
					interaction.reply({
						content: `:hourglass: You can reuse this command in ${Math.floor(
							Math.abs(Date.now() - cooldown) / 1000
						)} second(s)`,
						flags: MessageFlags.Ephemeral
					});
					setTimeout(() => interaction.deleteReply(), 5000);

					return;
				}

				interaction.client.cooldowns.set(
					`${interaction.commandName}-${interaction.user.username}`,
					Date.now() + command.cooldown * 1000
				);
				setTimeout(() => {
					interaction.client.cooldowns.delete(
						`${interaction.commandName}-${interaction.user.username}`
					);
				}, command.cooldown * 1000);
			} else if (command.cooldown && !cooldown) {
				interaction.client.cooldowns.set(
					`${interaction.commandName}-${interaction.user.username}`,
					Date.now() + command.cooldown * 1000
				);
			}

			command.execute(interaction);
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(
				interaction.commandName
			);

			if (!command || !command.autocomplete) return;
			try {
				command.autocomplete(interaction);
			} catch (error) {
				logger.error(
					{ command: interaction.commandName, error },
					"Could not autocomplete"
				);
			}
		} else if (interaction.isModalSubmit()) {
			const command = interaction.client.commands.get(
				interaction.customId.split("_")[0]
			);

			if (!command || !command.modal) return;
			try {
				command.modal(interaction);
			} catch (error) {
				logger.error(
					{ modal: interaction.customId, error },
					"Could not process modal"
				);
			}
		}
	}
};

export default event;
