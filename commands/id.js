const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
    
module.exports = {
    data: new SlashCommandBuilder()
        .setName("id")
        .setDescription("Returns id of user")
        .addUserOption(option=>
            option.setName("target")
            .setDescription("Select a user")),
    /**
     * 
     * @param {Discord.BaseCommandInteraction} interaction 
     */
    async execute(interaction) {

        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })

        try {
            const user = interaction.options.getUser("target")

            embed.setDescription(`Id of ${user.username} is ${user.id}`)

        } catch (error){

            embed.setDescription("Failed to get id of user")
            
            console.log(error)
        } finally {

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

        }
    }
}