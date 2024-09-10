import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import type { Command } from "../types";
import { version } from "../../package.json";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("version")
		.setDescription(
			"Displays the commit the bot is running on (and other infos because yes)"
		),

	execute: interaction => {
		const commit =
			process.env.GIT_COMMIT ||
			Bun.spawnSync(["git", "rev-parse", "HEAD"]).stdout.toString();

		const branch =
			process.env.GIT_BRANCH ||
			Bun.spawnSync([
				"git",
				"rev-parse",
				"--abbrev-ref",
				"HEAD"
			]).stdout.toString();

		const remote =
			process.env.GIT_REMOTE ||
			Bun.spawnSync([
				"git",
				"config",
				"--get",
				"remote.origin.url"
			]).stdout.toString();

		const system = Bun.spawnSync(["uname", "-r"]).stdout.toString();
		const embed = new EmbedBuilder()
			.setTitle(`SinfBot v${version}`)
			.setThumbnail(interaction.guild?.iconURL() ?? null)
			.addFields(
				{ name: "Commit", value: `\`${commit}\``, inline: true },
				{ name: "Branche", value: `\`${branch}\``, inline: true },
				{ name: "URL remote", value: `\`${remote}\`` },
				{ name: "Système", value: `\`${system}\`` }
			);

		interaction.reply({ embeds: [embed] });
	}
};

export default command;
