import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import Blindtest from "../db/models/blindtest";
import type { Command } from "../types";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("blindtest_edit_score")
        .setDescription("Add or remove points from a player")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user you want to modify")
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
                .setName("point")
                .setDescription("Points to add (positive) or remove (negative)")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    
    execute: async interaction => {
        const userToUpdate = interaction.options.getUser("user",true);
        const extraPoint = interaction.options.getNumber("point",true);
        const emoji = extraPoint < 0 ? "<:cheh:770702190843002890>" : "<:stonks:794909125258641408>";

        const [blind] = await Blindtest.findOrCreate({
            where: { userId: userToUpdate.id }
        });

        await Blindtest.update(
            { score: blind.score+extraPoint },
            { where: { userId: userToUpdate.id } }
        );

        const embed = new EmbedBuilder()
            .setTitle("Database Updated")
            .setDescription(`Congratulations, ${userToUpdate}! You have earned ${extraPoint} extra point(s) ${emoji}`)

        interaction.reply({ embeds: [embed] });

    }
};

export default command;