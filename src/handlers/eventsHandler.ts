import fs from "node:fs";
import path from "node:path";

import chalk from "chalk";
import { type Client } from "discord.js";

import type { Event } from "../types";

export default (client: Client) => {
	let eventsDir = path.join(__dirname, "../events");

	fs.readdirSync(eventsDir).forEach(async file => {
		if (!file.endsWith(".ts")) {
			console.log(
				`${chalk.yellow("WARN")} ${chalk.gray(
					">"
				)} Skipping event file ${file} (not a Typescript file)`
			);

			return;
		}

		const { default: event }: { default: Event } = await import(
			`file://${eventsDir}/${file}`
		);
		event.once
			? client.once(event.name, (...args) => event.execute(...args))
			: client.on(event.name, (...args) => event.execute(...args));

		console.log(
			`${chalk.cyan("INFO")} ${chalk.gray(">")} Loaded event "${
				event.name
			}"`
		);
	});
};
