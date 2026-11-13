import { Events, Message, PermissionFlagsBits, time } from "discord.js";

import Feur from "../db/models/feur";
import type { Event } from "../types";

const feurRegex = /\b(?:f\s*e\s*u\s*r|feur)\b/gi;
const funString = [
	"That's right, His Majesty is abusing his privileges",
	"Do you think it's funny to play at being a mini-dictator? Just so you know, a revolution is in the works",
	"Go ahead, abuse your tiny bit of power. But don't forget that the tables will turn",
	"That's great, keep ruling like a tyrant...",
	"Enjoy your power while it lasts. Tyrants always fall"
];

const event: Event = {
	name: Events.MessageCreate,
	execute: async (message: Message) => {
		const isAdmin = message.member?.permissions.has(
			PermissionFlagsBits.KickMembers
		);

		if (message.author.bot) return;

		if (message.content.match(feurRegex)) {
			const [feur] = await Feur.findOrCreate({
				where: {
					userId: message.author.id
				}
			});

			// Max timeout time is 28 days for the API
			const currAmount = feur.amount + 1;
			const timeout_time = Math.min(
				Math.pow(2, currAmount) * 1000,
				28 * 24 * 60 * 60 * 1000
			);

			await Feur.update(
				{
					amount: currAmount,
					isAdmin: isAdmin
				},
				{ where: { userId: message.author.id } }
			);

			const randomFunString =
				funString[Math.floor(Math.random() * funString.length)];
			const adminMessage = `You said feur ${currAmount} time(s). That's amazing!\n${randomFunString}`;

			try {
				if (!isAdmin) {
					await message.member?.timeout(
						timeout_time,
						`Said feur ${currAmount} time(s)`
					);

					const realTimeoutTime = timeout_time / 1000;

					const d = Math.floor(realTimeoutTime / (24 * 3600));
					const h = Math.floor(
						(realTimeoutTime % (24 * 3600)) / 3600
					);
					const m = Math.floor((realTimeoutTime % 3600) / 60);
					const s = Math.floor(realTimeoutTime % 60);

					const timeOutput =
						d == 28
							? `${d} days`
							: d > 0
								? `${d} days ${h} hours`
								: h > 0
									? `${h} hours ${m} minutes`
									: m > 0
										? `${m} minutes ${s} seconds`
										: `${s} seconds`;

					message.reply(
						`You said feur ${currAmount} time(s), you'll be timed out for ${timeOutput}!`
					);
				}

				// just to be sure, Modo can't be TO anymore
				else {
					message.reply(adminMessage);
				}
			} catch (_) {
				// Bot doesn't have the permission
				message.reply(adminMessage);

				// Bro is cheating with higher perms on discord
				await Feur.update(
					{ isAdmin: true },
					{ where: { userId: message.author.id } }
				);
			}
		}
	}
};

export default event;
