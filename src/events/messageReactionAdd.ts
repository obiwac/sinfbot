// Is this idea for the pin stolen from the EPLBot? Yes, yes it is.
// But sharing is caring

import chalk from "chalk";
import { Events, GuildMember, MessageReaction } from "discord.js";

import type { Event } from "../types";
import { Contest, ContestMessage, ContestVote } from "../db/models/contest";

const pinRoleId = process.env.PIN_ROLE_ID!;
const pinEmoji = process.env.PIN_EMOJI!;
const pinThreshold = Number(process.env.PIN_THRESHOLD!);
const excludedChannels = process.env.PIN_EXCLUDED_CHANNELS!.split(",");

const voteEmoji = process.env.VOTE_EMOJI!;

const event: Event = {
	name: Events.MessageReactionAdd,
	execute: async (reaction: MessageReaction, user: GuildMember) => {
		const message = reaction.message;
		const channelId = message.channel.id;

		// Retrieve the full message if it's not cached
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

		// Retrieve the full reaction if it's not cached
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

		// Pin logic
		if (reaction.emoji.name === pinEmoji) {
			if (excludedChannels.includes(message.channel.id) || message.pinned)
				return;

			const votes = message.reactions.cache.get(pinEmoji);
			const hasPinRole = message.guild?.members.cache
				.get(user.id)
				?.roles.cache.some(role => role.id === pinRoleId);

			if (votes && (votes.count >= pinThreshold || hasPinRole))
				await message.pin();
		}

		// Contest logic
		if (reaction.emoji.name === voteEmoji) {
			const contest = await Contest.findOne({ where: { channelId } });
			if (!contest) return;

			if (message.createdTimestamp < contest.startTime.getTime()) return;

			const existingVote = await ContestVote.findOne({
				where: { messageId: message.id, userId: user.id }
			});

			console.log(existingVote);
			console.log(message.id);
			console.log(user.id);

			if (existingVote) return;

			let contestMessage = await ContestMessage.findOne({
				where: { messageId: message.id, contestName: contest.name }
			});

			if (!contestMessage) {
				contestMessage = await ContestMessage.create({
					contestName: contest.name,
					messageId: message.id,
					reactionCount: 0
				});
			}

			contestMessage.reactionCount++;
			await contestMessage.save();

			await ContestVote.create({
				messageId: contestMessage.messageId,
				userId: user.id
			});
		}
	}
};

export default event;
