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
            const embed = new Discord.MessageEmbed();

            embed.setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL()
            }).setColor("LUMINOUS_VIVID_PINK")

            if (flipnum == 0){
                embed.setDescription(`${interaction.user.username} has flipped **head**`).setImage("https://cdn.discordapp.com/attachments/696045581180862585/1005774664167063613/head.png")
            } else {
                embed.setDescription(`${interaction.user.username} has flipped **tail**`).setImage("https://cdn.discordapp.com/attachments/696045581180862585/1005776838691409950/tail.png")
            }

            await interaction.reply({
                embeds: [
                    embed
                ]
            })
        } catch (error) {
            console.log(error)
        }
    } 
}