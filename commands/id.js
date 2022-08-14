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
        const embed = new Discord.MessageEmbed();
        const user = interaction.options.getUser("target")
        await interaction.channel.send({
            embeds: [
                embed.setAuthor({
                    name: `${interaction.user.tag}`,
                    iconURL: interaction.user.avatarURL()
                }).setDescription(`Id of ${user.username} is ${user.id}`)
            ]
        })
        
    }
}