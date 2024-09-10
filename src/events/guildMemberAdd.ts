import { EmbedBuilder, Events, GuildMember } from "discord.js";
import type { Event } from "../types";

const event: Event = {
	name: Events.GuildMemberAdd,
	execute: (member: GuildMember) => {
		const embed = new EmbedBuilder()
			.setTitle("Bienvenue sur le Discord SINF !")
			.setThumbnail(member.guild.iconURL()).setDescription(`
				Ce serveur a pour but de réunir tous les étudiants en informatique en un seul serveur Discord. L'accent est mis sur le partage et l'entraide entre étudiants. Vous avez ici le droit de discuter, poser vos questions, donner votre avis sur un cours, partager vos tuyaux/synthèses/découvertes, recruter/chercher des personnes pour un projet (non limité aux cours), jouer, ...
				
				Nous organisons également régulièrement des petits événements : le meme contest, distribution de stickers, concours de celui qui a le plus beau chat/setup/...
				
				Pour l'instant, tu n'as seulement accès aux channels communautaires. L'inscription aux différents channels de cours se fait via le widget "Chercher des salons" en haut de la liste de canaux.
				
				N'oublie pas de lire les règles.
			`);

		member.send({ embeds: [embed] });
	}
};

export default event;
