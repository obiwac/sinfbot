import chalk from "chalk";
import { Events, type Client } from "discord.js";
import type { Event } from "../types";
import db from "../db/main";

const event: Event = {
	name: Events.ClientReady,
	once: true,
	execute: async (client: Client) => {
		try {
			await db.sync();
			console.log(
				`${chalk.cyan("INFO")} ${chalk.gray(">")} Database synced`
			);
		} catch (error) {
			console.error(
				`${chalk.red("Error")} ${chalk.gray(
					">"
				)} Failed to sync the database: ${error}`
			);

			process.exit(1);
		}

		console.log(
			`${chalk.green.bold("Ready")} ${chalk.gray(
				">"
			)} Client logged in as ${client.user?.tag}`
		);
	}
};

export default event;
