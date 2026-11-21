import {
	EmbedBuilder,
	Events,
	MessageFlags,
	type Interaction
} from "discord.js";

import { getLogger } from "../logger";
import type { Event } from "../types";
import { createBlindtest } from "../commands/blindtest";

const logger = getLogger("interactionCreate");

const event: Event = {
	name: Events.InteractionCreate,
	execute: async (interaction: Interaction) => {
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

			// Accept old Blindtest requests (in case the Blindtest times out due to too many requests)
		} else if (
			interaction.isButton() &&
			interaction.customId === "resubmit"
		) {
			const embed = interaction.message.embeds[0];
			const description = embed.description?.split(" ");

			if (!description) return;

			const requester = await interaction.client.users.fetch(
				description[0].slice(2, -1)
			);
			const songUrl = description.at(11);
			const showName = description.at(6);
			const start = Number(description.at(-2));

			if (!songUrl) return;

			await interaction.message.edit({
				embeds: [
					EmbedBuilder.from(embed)
						.setTitle("Blindtest approved")
						.setColor(0x00ff00)
				],
				components: []
			});

			const sentBlindtest = await createBlindtest(
				songUrl,
				requester,
				interaction.client,
				start
			);

			await requester
				.send({
					embeds: [
						new EmbedBuilder()
							.setTitle("Blindtest approved")
							.setDescription(
								`Your Blindtest ${showName} has finally been approved. It is now available publicly.\n\n> [Click here](${sentBlindtest.url}) to view it`
							)
							.setColor(0x00ff00)
					]
				})
				.catch(() => undefined);
		}
	}
};

export default event;
