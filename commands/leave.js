const { SlashCommandBuilder } = require('@discordjs/builders');
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
        try {

            if (interaction.guild.voiceConnection){

                interaction.guild.voiceConnection.disconnect();

                const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()
                })
                .setDescription("Left voice channel")

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                })
            } else {

            }
           
        } catch (error) {
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()
                })
                .setDescription("Failed to leave the voice channel")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

            console.log(error)
        }
       
    }
}