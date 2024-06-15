// Is this idea stolen from the EPLBot? Yes, yes it is.
// But sharing is caring

import chalk from "chalk";
import { Events, Message } from "discord.js";

import type { Event } from "../types";

const pinRoleId = process.env.PIN_ROLE_ID!;
const pinEmoji = process.env.PIN_EMOJI!;
const pinThreshold = Number(process.env.PIN_THRESHOLD!);
const excludedChannels = process.env.PIN_EXCLUDED_CHANNELS!.split(",");

const event: Event = {
	name: Events.MessageReactionAdd,
	execute: async (reaction, user) => {
		const message: Message = reaction.message;

		if (excludedChannels.includes(message.channel.id)) return;

		if (message.partial) {
			try {
				await message.fetch();
			} catch (error) {
				console.error(
					`${chalk.redBright.bold("ERROR")} ${chalk.gray(
						">"
					)} (messageReactionAdd) Error while fetching full message: ${error}`
				);

				return;
			}
		}

		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (error) {
				console.error(
					`${chalk.redBright.bold("ERROR")} ${chalk.gray(
						">"
					)} (messageReactionAdd) Error while fetching full reaction: ${error}`
				);

				return;
			}
		}

		const votes = message.reactions.cache.get(pinEmoji);
		const hasPinRole = message.guild?.members.cache
			.get(user.id)
			?.roles.cache.some(role => role.id === pinRoleId);

		if (
			votes &&
			(votes.count >= pinThreshold || hasPinRole) &&
			!message.pinned
		)
			await message.pin();
	}
};

export default event;
