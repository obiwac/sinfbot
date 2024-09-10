import fs from "node:fs";
import path from "node:path";

import chalk from "chalk";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import "dotenv/config";

import { type Command } from "./types";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
const handlersDir = path.join(__dirname, "./handlers");

client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

(async () => {
	for (const handler of fs.readdirSync(handlersDir)) {
		if (!handler.endsWith(".ts")) {
			console.log(
				`${chalk.yellow("WARN")} ${chalk.gray(
					">"
				)} Skipping handler file ${handler} (not a Typescript file)`
			);

			continue;
		}

		const handlerLoader = await import(`file://${handlersDir}/${handler}`);
		if (!handlerLoader.default) {
			console.log(
				`${chalk.yellow("WARN")} ${chalk.gray(
					">"
				)} Skipping handler file ${handler} (import returned "undefined", is the handler correctly exported?)`
			);

			continue;
		}

		await handlerLoader.default(client);
	}

	client.login(process.env.DISCORD_TOKEN!);
})();
