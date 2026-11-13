import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import Blindtest from "../db/models/blindtest";
import Feur from "../db/models/feur";
import type { Command } from "../types";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("edit")
        .setDescription("edit a user in the DataBase (blindtest or feur)")
        .addSubcommand(subcommand =>
            subcommand
                .setName("blindtest")
                .setDescription("edit the blindtest database")
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
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("feur")
                .setDescription("edit the feur database")
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
                .addBooleanOption(option =>
                    option
                        .setName("admin")
                        .setDescription("Set (true) or remove (false) admin status (leave empty to keep unchanged)")
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    
    execute: async interaction => {
        const userToUpdate = interaction.options.getUser("user",true);
        const extraPoint = interaction.options.getNumber("point",true);
        const isAdmin = interaction.options.getBoolean("admin")
        const subCommand = interaction.options.getSubcommand();
        
        const emoji = extraPoint < 0 ? "<:cheh:770702190843002890>" : "<:stonks:794909125258641408>";
        const rowName = subCommand === "blindtest" ? "score" : "amount";
        const str = subCommand === "blindtest" ? "point(s)" : "feur(s)";

        const [data] = subCommand === "blindtest" ? 
            await Blindtest.findOrCreate({
                where: { userId: userToUpdate.id }
            })
            :
            await Feur.findOrCreate({
                where: { userId: userToUpdate.id }
            });

        await data.increment(rowName, {by: extraPoint})

        if (subCommand==="feur" && isAdmin!==null){
            await data.update(
                { isAdmin: isAdmin }
            );
        }

        const embed = new EmbedBuilder()
            .setTitle("Database Updated")
            .setDescription(`Congratulations, ${userToUpdate}! You have earned ${extraPoint} extra ${str} ${emoji}`)

        interaction.reply({ embeds: [embed] });

    }
};

export default command;