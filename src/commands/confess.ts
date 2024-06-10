import {
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
	SlashCommandBuilder,
	TextChannel,
	TextInputStyle,
	type MessageActionRowComponentBuilder
} from "discord.js";
import {
	ActionRowBuilder,
	type ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder
} from "@discordjs/builders";

// TODO: Do some clean up here

import type { Command } from "../types";

const vote_minutes = Number(process.env.CONFESSION_VOTE_MINUTES);

const command: Command = {
	data: new SlashCommandBuilder()
		.setName("confess")
		.setDescription("Confess a sin to the entire world"),

	execute: async interaction => {
		const modal = new ModalBuilder()
			.setCustomId("confess")
			.setTitle("Confession");

		const confessText = new TextInputBuilder()
			.setCustomId("confessText")
			.setLabel("Your confession")
			.setPlaceholder(
				"No questions that could be sent publicly, no hate (thanks <3)"
			)
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true);

		const actionRow =
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				confessText
			);

		modal.addComponents(actionRow);

		await interaction.showModal(modal);
	},

	modal: async interaction => {
		const adminChannel = (await interaction.client.channels.fetch(
			process.env.ADMIN_CHANNEL_ID!
		)) as TextChannel;

		const confessionChannel = (await interaction.client.channels.fetch(
			process.env.CONFESSION_CHANNEL_ID!
		)) as TextChannel;

		const confessText = interaction.fields.getTextInputValue("confessText");
		const embed = new EmbedBuilder()
			.setTitle("Confession")
			.setDescription(confessText);

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

		const warnButton = new ButtonBuilder()
			.setCustomId("warn")
			.setLabel("Warn user")
			.setStyle(ButtonStyle.Danger)
			.setEmoji({ name: "⚠️" });

		const actionRow =
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				approveButton,
				rejectButton,
				warnButton
			);

		let vote = await adminChannel.send({
			embeds: [embed],
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
					let sentConfession = await confessionChannel.send({
						embeds: [embed]
					}); // We await so that the color isn't changed before the confession is sent

					vote.edit({
						embeds: [
							embed
								.setTitle("Confession approved")
								.setColor(0x00ff00)
						],
						components: []
					});

					interaction.user
						.send({
							embeds: [
								new EmbedBuilder()
									.setTitle("Confession approved")
									.setDescription(
										`Your confession "*${confessText}*" was approved. It is now available publicly.\n[Click here](${sentConfession.url}) to view it`
									)
									.setColor(0x00ff00)
							]
						})
						.catch(() => undefined);

					break;

				case "reject":
					vote.edit({
						embeds: [
							embed
								.setTitle("Confession rejected")
								.setColor(0xff0000)
						],
						components: []
					});

					interaction.user
						.send({
							embeds: [
								new EmbedBuilder()
									.setTitle("Confession rejected")
									.setDescription(
										`Your confession "*${confessText}*" has been rejected. It will not be shared publicly.`
									)
									.setColor(0xff0000)
							]
						})
						.catch(() => undefined);

					break;

				default:
					// Add cooldown as a warning
					interaction.client.cooldowns.set(
						`confess-${interaction.user.username}`,
						Date.now() + 3600 * 1000
					);

					vote.edit({
						embeds: [
							embed
								.setTitle("Confession rejected and user warned")
								.setColor(0xffa500)
						],
						components: []
					});

					interaction.user
						.send({
							embeds: [
								new EmbedBuilder()
									.setTitle("WARNING")
									.setDescription(
										`Your confession "*${confessText}*" has been rejected and you have been issued a warning. Please note that confessions are **NOT** intended for this purpose. This includes (but not limited to): asking questions about courses (refer to the channel in question), sexual/violent/discriminating content, or stuff that crosses the line of being a bit too edgy. You'll be able to post a new confession in 1h. Please do help keep this a safe space :)`
									)
									.setColor(0xffa500)
							]
						})
						.catch(() => undefined);
			}
		});

		collector.on("end", async (_, reason) => {
			if (reason === "time") {
				// Vote timed out
				vote.edit({
					embeds: [
						embed.setTitle("Vote timed out").setColor(0x808080)
					],
					components: []
				});

				interaction.user
					.send({
						embeds: [
							new EmbedBuilder()
								.setTitle("Confession rejected")
								.setDescription(
									`Your confession "*${confessText}*" received no votes, it was therefore rejected. You can however resubmit it with the command /confess`
								)
								.setColor(0x808080)
						]
					})
					.catch(() => undefined);
			}
		});

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Confession sent")
					.setDescription(
						"Your confession has been sent and is awaiting verification. If your DM's are open to everyone, you'll be notified when it has been approved or rejected."
					)
					.setColor(0x5865f2)
			],
			ephemeral: true
		});
	},

	cooldown: 30
};

export default command;
