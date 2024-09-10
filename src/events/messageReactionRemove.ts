import { Events, Message } from "discord.js";

import type { Event } from "../types";

const pinRoleId = process.env.PIN_ROLE_ID!;
const excludedChannels = process.env.PIN_EXCLUDED_CHANNELS!.split(",");

const event: Event = {
	name: Events.MessageReactionRemove,
	execute: async (reaction, user) => {
		// DiscordJS only listens to reactions on messages that are cached
		// TODO: Find a way to cache old messages
		const message: Message = reaction.message;

		if (excludedChannels.includes(message.channel.id) || !message.pinned)
			return;

		const hasPinRole = message.guild?.members.cache
			.get(user.id)
			?.roles.cache.some(role => role.id === pinRoleId);

		if (hasPinRole) {
			await message.unpin();
		}
	}
};

export default event;
