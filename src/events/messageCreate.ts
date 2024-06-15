import { Events, Message } from "discord.js";

import Feur from "../db/models/feur";
import type { Event } from "../types";

const feurRegex = /\b(?:f\s*e\s*u\s*r|feur)\b/gi;

const event: Event = {
	name: Events.MessageCreate,
	execute: async (message: Message) => {
		if (message.author.bot) return;

		if (message.content.match(feurRegex)) {
			const [feur] = await Feur.findOrCreate({
				where: { userId: message.author.id },
				useMaster: true
			});

			await feur.increment("amount");
			const timeout_time = Math.pow(2, feur.amount) * 1000;

			try {
				await message.member?.timeout(
					timeout_time,
					`Said feur ${feur.amount} times`
				);

				message.reply(
					`You said feur ${
						feur.amount
					} times, you'll be timed out for ${
						timeout_time / 1000
					} seconds!`
				);
			} catch (_) {
				// Bot doesn't have the permission
				message.reply(
					`You said feur ${feur.amount} times. That's amazing!`
				);
			}
		}
	}
};

export default event;
