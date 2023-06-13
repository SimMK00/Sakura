const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Returns latency"),
    async execute(interaction){

        try {
            const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })
            .setColor("LuminousVividPink")
            .setDescription(`Pong! The latency is ${Date.now()-interaction.createdTimestamp}ms`)

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

        } catch (error){
            const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })
            .setColor("LuminousVividPink")
            .setDescription("Failed to ping")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

            console.log(error)
        } 
    } 
}