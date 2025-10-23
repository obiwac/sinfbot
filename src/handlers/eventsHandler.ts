import fs from "node:fs";
import path from "node:path";

import { type Client } from "discord.js";

import { getLogger } from "../logger";
import type { Event } from "../types";

const logger = getLogger("eventsHandler");

export default (client: Client) => {
	let eventsDir = path.join(__dirname, "../events");

	fs.readdirSync(eventsDir).forEach(async file => {
		if (!file.endsWith(".ts")) {
			logger.warn(
				{ file, reason: "Not a Typescript file" },
				"Skipping event"
			);
			return;
		}

		const { default: event }: { default: Event } = await import(
			`file://${eventsDir}/${file}`
		);
		if (!event) {
			logger.warn(
				{ file, reason: 'Import returned "undefined"' },
				"Skipping event"
			);
			return;
		}

		event.once
			? client.once(event.name, (...args) => event.execute(...args))
			: client.on(event.name, (...args) => event.execute(...args));

		logger.info({ event: event.name }, "Loaded event");
	});
};
