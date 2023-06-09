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
        try {
            const user = interaction.options.getUser("target")

            const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })
            .setDescription(`Id of ${user.username} is ${user.id}`)


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
            .setDescription("Failed to get id of user")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

            console.log(error)
        }
    }
}