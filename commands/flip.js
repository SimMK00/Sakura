const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    
    data: new SlashCommandBuilder()
        .setName("flip")
        .setDescription("Flips a coin"),
    /**
     * 
     *  @param {Discord.BaseCommandInteraction} interaction  
     */
    async execute(interaction){
        try {
            const flipnum = Math.round(Math.random());
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()
                })
                .setColor("LuminousVividPink")
            
            var attachment;
            if (flipnum == 0){
                attachment = new Discord.AttachmentBuilder('./images/head.png');

                embed
                    .setDescription(`${interaction.user.username} has flipped **head**`)
                    .setImage(('attachment://head.png'))
            } else {
                attachment = new Discord.AttachmentBuilder('./images/tail.png');
                
                embed
                    .setDescription(`${interaction.user.username} has flipped **tail**`)
                    .setImage(('attachment://tail.png'))
            }

            await interaction.reply({
                embeds: [embed],
                files: [attachment],
                ephemeral: true,
            })

        } catch (error) {

            const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })
            .setColor("LuminousVividPink")
            .setDescription("Failed to perform command")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

            console.log(error)
        }
    } 
}