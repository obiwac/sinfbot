import {
	ChannelType,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextChannel
} from "discord.js";

import { Contest, ContestMessage } from "../db/models/contest";
import type { Command } from "../types";

const voteEmoji = process.env.VOTE_EMOJI!;

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
				.setName("list")
				.setDescription("List all ongoing contests")
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

			const existingContest = await Contest.findOne({
				where: { name }
			});
			if (existingContest) {
				return interaction.reply({
					content: ":x: Contest with the same name already exists",
					ephemeral: true
				});
			}

			Contest.create({
				name,
				channelId: channel.id,
				startTime: new Date(),
				endTime: endTimeDate
			});

			interaction.reply({
				content: `:white_check_mark: Contest \`${name}\` created`,
				ephemeral: true
			});

			const embed = new EmbedBuilder()
				.setTitle("Contest")
				.setDescription(
					`Contest \`${name}\` has started in this channel! Add the reaction ${voteEmoji} to vote for a message.`
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
		} else if (interaction.options.getSubcommand() === "list") {
			const contests = await Contest.findAll();

			if (contests.length === 0)
				return interaction.reply({
					content: ":x: No ongoing contests",
					ephemeral: true
				});

			const embed = new EmbedBuilder()
				.setTitle("Ongoing Contests")
				.addFields(
					contests.map(contest => ({
						name: contest.name,
						value: `<#${
							contest.channelId
						}>, ends on <t:${Math.floor(
							contest.endTime.getTime() / 1000
						)}:f>`
					}))
				);

			interaction.reply({ embeds: [embed], ephemeral: true });
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
				where: { contestName: contest.name },
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

			Contest.destroy({ where: { name } });

			interaction.reply({
				content: `:white_check_mark: Contest \`${name}\` ended`,
				ephemeral: true
			});

			(channel as TextChannel).send({ embeds: [embed] });
		}
	}
};

export default command;
