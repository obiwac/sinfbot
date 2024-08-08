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
				where: { userId: message.author.id }
			});

			const currAmount = feur.amount;
			const timeout_time = Math.pow(2, feur.amount) * 1000;
			
			// feur.amount += 1;
			await Feur.update(
				{amount: currAmount+1},
				{ where: { userId: message.author.id } }
			)			

			try {
				await message.member?.timeout(
					timeout_time,
					`Said feur ${currAmount} time(s)`
				);

				message.reply(
					`You said feur ${
						currAmount
					} time(s), you'll be timed out for ${
						timeout_time / 1000
					} seconds!`
				);
			} catch (_) {
				// Bot doesn't have the permission
				message.reply(
					`You said feur ${feur.amount} time(s). That's amazing!`
				);
			}
		}
	}
};

export default event;
