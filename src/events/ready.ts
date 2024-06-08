import chalk from "chalk";
import { Events, type Client } from "discord.js";
import type { Event } from "../types";

const event: Event = {
	name: Events.ClientReady,
	once: true,
	execute: (client: Client) => {
		console.log(
			`${chalk.green.bold("Ready")} ${chalk.gray(
				">"
			)} Client logged in as ${client.user?.tag}`
		);
	}
};

export default event;
