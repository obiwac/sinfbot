import fs from "node:fs";
import path from "node:path";

import chalk from "chalk";
import {
	SlashCommandBuilder,
	REST,
	type Client,
	Routes,
	SharedSlashCommand
} from "discord.js";

import type { Command } from "../types";

export default async (client: Client) => {
	const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
	const commands: SharedSlashCommand[] = [];
	let commandsDir = path.join(__dirname, "../commands");

	try {
		const commandFiles = fs.readdirSync(commandsDir);

		for (const file of commandFiles) {
			if (!file.endsWith(".ts")) {
				console.log(
					`${chalk.yellow("WARN")} ${chalk.gray(
						">"
					)} Skipping command file ${file} (not a Typescript file)`
				);

				continue;
			}

			let { default: command }: { default: Command } = await import(
				`file://${commandsDir}/${file}`
			);

			if (!command) {
				console.log(
					`${chalk.yellow("WARN")} ${chalk.gray(
						">"
					)} Skipping command file ${file} (import returned "undefined", is the command correctly exported?)`
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

		console.log(
			`${chalk.cyan("INFO")} ${chalk.gray(">")} Loaded and registered ${
				res.length
			} command(s)`
		);
	} catch (error) {
		console.error(
			`${chalk.redBright.bold("ERROR")} ${chalk.gray(
				">"
			)} Error while registering commands: ${error}`
		);

		process.exit(1);
	}
};
