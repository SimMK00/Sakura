const { SlashCommandBuilder } = require('@discordjs/builders');
const Voice = require("@discordjs/voice");
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leaves the voice channel the bot is in"),
    /**
     * 
     *  @param {Discord.BaseCommandInteraction} interaction  
     */
    async execute(interaction){
        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })
            .setColor("LuminousVividPink")

        try {
            const connection = Voice.getVoiceConnection(interaction.guild.id)

            if (connection){
                connection.destroy();
                embed.setDescription("Left voice channel")
            } else {
                embed.setDescription("The bot is not currently in any voice channel")
            }
        } catch (error) {
            embed.setDescription("Failed to leave the voice channel")
        } finally {
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }
       
    }
}