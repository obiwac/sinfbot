import fs from "node:fs";
import path from "node:path";

import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import "dotenv/config";

import { getLogger } from "./logger";
import type { Command } from "./types";

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
const logger = getLogger("main");

client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

(async () => {
	for (const handler of fs.readdirSync(handlersDir)) {
		if (!handler.endsWith(".ts")) {
			logger.warn(
				{ handler, reason: "Not a Typescript file" },
				"Skipping handler"
			);
			continue;
		}

		const handlerLoader = await import(`file://${handlersDir}/${handler}`);
		if (!handlerLoader.default) {
			logger.warn(
				{ handler, reason: 'Import returned "undefined"' },
				"Skipping handler"
			);
			continue;
		}

		await handlerLoader.default(client);
	}

	client.login(process.env.DISCORD_TOKEN!);
})();
