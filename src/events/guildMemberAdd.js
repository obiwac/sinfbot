const { Client, GuildMember } = require('discord.js')

module.exports = {
  name: 'guildMemberAdd', // Triggered when someone joins the server
  once: false,

  async execute(_, member) {
    const welcomeMessage = `Bienvenue sur le Discord SINF\nCe serveur a pour but de réunir tous les étudiants en informatique en un seul serveur Discord. L'accent est mis sur le partage et l'entraide entre étudiants.\nVous avez ici le droit de discuter, poser vos questions, donner votre avis sur un cours, partager vos tuyaux/synthèses/découvertes, recruter/chercher des personnes pour un projet (non limité aux cours), jouer, ...\nNous organisons également régulièrement des petits événements : le meme contest, distribution de stickers, concours de celui qui a le plus beau chat/setup/...\n\nPour l'instant, tu n'as seulement accès aux channels communautaires.\n\nL'inscription aux différents channels de cours se fait via le widget "Chercher des salons" en haut de la liste de canaux.\n\nN'oublie pas de lire les règles.`

    if (member.username.toLowerCase().includes('reixam')) {
      return member.ban('Reixam')
    }

    return member.send(welcomeMessage)
  },
}
