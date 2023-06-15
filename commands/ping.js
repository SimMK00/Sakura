const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Returns latency"),
    async execute(interaction){

        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })
            .setColor("LuminousVividPink")

        try {
            embed.setDescription(`Pong! The latency is ${Date.now()-interaction.createdTimestamp}ms`)
        } catch (error){
            embed.setDescription("Failed to ping")
            console.log(error)
        } finally {
            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })
        }
    } 
}