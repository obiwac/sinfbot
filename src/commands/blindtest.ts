import {
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
	MessageFlags,
	SlashCommandBuilder,
	TextChannel,
	codeBlock,
	type MessageActionRowComponentBuilder
} from "discord.js";

import { ActionRowBuilder } from "@discordjs/builders";

import type { Command } from "../types";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { unlink } from "node:fs/promises";
import { Quality, Ytdl } from "@distube/ytdl-core";
import { ffmpeg } from "ffmpeg";

const vote_minutes = Number(process.env.BLINDTEST_VOTE_MINUTES);

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("blindtest")
		.setDescription("Suggest a song for the blindtest")
		.addStringOption(option =>
			option
				.setName("show")
				.setDescription(
					"The name of the show (or game) you want to suggest"
				)
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("link")
				.setDescription("The youtube link of you requested song")
				.setRequired(true)
		),

	execute: async interaction => {
		const songUrl = interaction.options.getString("link", true);
		const showName = interaction.options.getString("show", true);
		const requester = interaction.user;
		const ytb = new Ytdl();

		// Check whether it is a YouTube link or whether the video is not private
		try {
			const info = await ytb.getInfo(songUrl);
		} catch (error) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("Error")
						.setDescription(
							"Something bad happened. Are you sure your link comes from YouTube?\nIf so, the website is probably down."
						)
						.setColor(0x5865f2)
				],
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		const adminChannel = (await interaction.client.channels.fetch(
			process.env.BLINDTEST_ADMIN_CHANNEL_ID!
		)) as TextChannel;

		const blindtestChannel = (await interaction.client.channels.fetch(
			process.env.BLINDTEST_CHANNEL_ID!
		)) as TextChannel;

		const embedAdmin = new EmbedBuilder()
			.setTitle("Blindtest")
			.setDescription(
				`${requester} has requested a song from ${codeBlock(showName)}Here is the link ${songUrl} `
			);

		const approveButton = new ButtonBuilder()
			.setCustomId("approve")
			.setLabel("Approve")
			.setStyle(ButtonStyle.Success)
			.setEmoji({ name: "✅" });

		const rejectButton = new ButtonBuilder()
			.setCustomId("reject")
			.setLabel("Reject")
			.setStyle(ButtonStyle.Secondary)
			.setEmoji({ name: "❌" });

		const actionRow =
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				approveButton,
				rejectButton
			);

		let vote = await adminChannel.send({
			embeds: [embedAdmin],
			components: [actionRow]
		});

		const collector = vote.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: vote_minutes * 60 * 1000
		});

		collector.on("collect", async i => {
			collector.stop();
			i.deferUpdate(); // Acknoledges the interaction without doing anything

			switch (i.customId) {
				case "approve":
					let sentBlindtest;

					vote.edit({
						embeds: [
							embedAdmin
								.setTitle("Blindtest approved")
								.setColor(0x00ff00)
						],
						components: []
					});

					// download the music
					const info = await ytb.getInfo(songUrl);
					await pipeline(
						ytb.download(info, {
							quality: Quality.HighestAudio,
							filter: { hasAudio: true, hasVideo: false }
						}),
						createWriteStream("./src/data/audio.mp3")
					);

					// trim it at 1 min
					const audio = await ffmpeg("./src/data/audio.mp3");
					await audio
						.setVideoDuration(60)
						.save("./src/data/newAudio.mp3");

					// send it to the channel
					sentBlindtest = await blindtestChannel.send({
						files: [
							{
								attachment: "./src/data/newAudio.mp3",
								name: "audio.mp3"
							}
						]
					});
					await sentBlindtest.startThread({ name: "Answer" });

					// remove the files
					unlink("./src/data/audio.mp3");
					unlink("./src/data/newAudio.mp3");

					interaction.user
						.send({
							embeds: [
								new EmbedBuilder()
									.setTitle("Blindtest approved")
									.setDescription(
										`Your Blindtest${codeBlock(showName)}was approved. It is now available publicly.\n\n> [Click here](${sentBlindtest.url}) to view it`
									)
									.setColor(0x00ff00)
							]
						})
						.catch(() => undefined);

					break;

				case "reject":
					vote.edit({
						embeds: [
							embedAdmin
								.setTitle("Blindtest rejected")
								.setColor(0xff0000)
						],
						components: []
					});

					interaction.user
						.send({
							embeds: [
								new EmbedBuilder()
									.setTitle("Blindtest rejected")
									.setDescription(
										`Your Blindtest${codeBlock(showName)}has been rejected. It will not be shared publicly.`
									)
									.setColor(0xff0000)
							]
						})
						.catch(() => undefined);

					break;
			}
		});

		collector.on("end", async (_, reason) => {
			if (reason === "time") {
				// Vote timed out
				vote.edit({
					embeds: [
						embedAdmin.setTitle("Vote timed out").setColor(0x808080)
					],
					components: []
				});

				interaction.user
					.send({
						embeds: [
							new EmbedBuilder()
								.setTitle("Blindtest rejected")
								.setDescription(
									`Your blindtest${codeBlock(showName)}received no votes, it was therefore rejected. You can however resubmit it with the command /blindtest`
								)
								.setColor(0x808080)
						]
					})
					.catch(() => undefined);
			}
		});

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Blindtest sent")
					.setDescription(
						"Your idea for the blindtest has been sent and is awaiting verification. If your DM's are open to everyone, you'll be notified when it has been approved or rejected."
					)
					.setColor(0x5865f2)
			],
			flags: MessageFlags.Ephemeral
		});
	},
	cooldown: 5
};
export default command;
