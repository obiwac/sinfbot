import fs from "node:fs";
import path from "node:path";

import { REST, type Client, Routes, SharedSlashCommand } from "discord.js";

import { getLogger } from "../logger";
import type { Command } from "../types";

const logger = getLogger("commandsHandler");

export default async (client: Client) => {
	const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
	const commands: SharedSlashCommand[] = [];
	let commandsDir = path.join(__dirname, "../commands");

	try {
		const commandFiles = fs.readdirSync(commandsDir);

		for (const file of commandFiles) {
			if (!file.endsWith(".ts")) {
				logger.warn(
					{ file, reason: "Not a Typescript file" },
					"Skipping command"
				);
				continue;
			}

			let { default: command }: { default: Command } = await import(
				`file://${commandsDir}/${file}`
			);

			if (!command) {
				logger.warn(
					{ file, reason: 'Import returned "undefined"' },
					"Skipping command"
				);
				continue;
			}

			commands.push(command.data);
			client.commands.set(command.data.name, command);
		}

		const res: any = await rest.put(
			Routes.applicationGuildCommands(
				process.env.DISCORD_APPLICATION_ID!,
				process.env.DISCORD_GUILD_ID!
			),
			{ body: commands }
		);

		logger.info(
			{ num_commands: res.length },
			"Loaded and registered commands"
		);
	} catch (error) {
		logger.error({ error }, "Couldn't register commands");
		process.exit(1);
	}
};
