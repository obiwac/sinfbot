import {
	ChannelType,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextChannel
} from "discord.js";

import { Contest, ContestMessage } from "../db/models/contest";
import type { Command } from "../types";

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("contest")
		.setDescription("Manage everything contest related")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName("create")
				.setDescription("Create a new contest")
				.addStringOption(option =>
					option
						.setName("name")
						.setDescription("Name of the contest")
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName("description")
						.setDescription("Description of the contest")
						.setRequired(true)
				)
				.addChannelOption(option =>
					option
						.setName("channel")
						.setDescription("Channel to create the contest in")
						.setRequired(true)
				)
				.addStringOption(option =>
					option
						.setName("end-time")
						.setDescription("When the contest should end")
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("end")
				.setDescription("End a contest")
				.addStringOption(option =>
					option
						.setName("name")
						.setDescription("Name of the contest")
						.setRequired(true)
				)
		),

	execute: async interaction => {
		if (interaction.options.getSubcommand() === "create") {
			const name = interaction.options.getString("name", true);
			const description = interaction.options.getString(
				"description",
				true
			);
			const channel = interaction.options.getChannel("channel", true);
			const endTime = interaction.options.getString("end-time", true);
			const endTimeDate = new Date(endTime);

			if (channel.type !== ChannelType.GuildText)
				return interaction.reply({
					content:
						":x: Contests can only be created in text channels",
					ephemeral: true
				});

			if (isNaN(endTimeDate.getTime()) || endTimeDate < new Date())
				return interaction.reply({
					content: ":x: Invalid date",
					ephemeral: true
				});

			Contest.create({
				name,
				channelId: channel.id,
				endTime: endTimeDate
			});

			interaction.reply({
				content: `:white_check_mark: Contest \`${name}\` created`,
				ephemeral: true
			});

			const embed = new EmbedBuilder()
				.setTitle("Contest")
				.setDescription(
					`Contest \`${name}\` has started in this channel!`
				)
				.addFields(
					{
						name: "Description",
						value: description
					},
					{
						name: "End Time",
						value: `<t:${Math.floor(
							endTimeDate.getTime() / 1000
						)}:f>`
					}
				);

			(channel as TextChannel).send({ embeds: [embed] });
		} else {
			const name = interaction.options.getString("name", true);
			const contest = await Contest.findOne({
				where: { name }
			});

			if (!contest)
				return interaction.reply({
					content: ":x: Contest not found",
					ephemeral: true
				});

			const winner = await ContestMessage.findOne({
				where: { contestId: contest.id },
				order: [["reactionCount", "DESC"]]
			});

			if (!winner)
				return interaction.reply({
					content: ":x: No entries found",
					ephemeral: true
				});

			const channel = interaction.guild?.channels.cache.get(
				contest.channelId
			);

			if (!channel)
				return interaction.reply({
					content: ":x: Channel not found",
					ephemeral: true
				});

			const message = await (channel as TextChannel).messages.fetch(
				winner.messageId
			);

			const embed = new EmbedBuilder()
				.setTitle("Contest Ended")
				.setDescription(
					`Contest \`${name}\` has ended! The winner is <@${message.author.id}> with ${winner.reactionCount} vote(s) (Check the message [here](${message.url}))`
				);

			interaction.reply({
				content: `:white_check_mark: Contest \`${name}\` ended`,
				ephemeral: true
			});

			(channel as TextChannel).send({ embeds: [embed] });
		}
	}
};

export default command;
