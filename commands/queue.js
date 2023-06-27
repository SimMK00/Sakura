const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const { createEmbedBase } = require('../utils/embedUtils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Displays the current song queue"),
    /**
     * 
     *  @param {Discord.BaseCommandInteraction} interaction  
     */
    async execute(interaction){
        const embed = createEmbedBase(interaction);

        try {
            const queue = interaction.client.queue.get(interaction.guild.id);
            
            if (queue){
                let songList = `**Queued tracks: **\n`;
                queue.forEach((element, index)=>{
                    songList += `${index+1}: ${element.title} (${element.durationRaw})\n`
                })
    
                embed.setDescription(songList);
    
                await interaction.reply({
                    embeds: [embed]
                })
            } else {
                embed.setDescription('Queue does not exist');
    
                await interaction.reply({
                    embeds: [embed]
                })
            }


        } catch (error) {
            embed.setDescription('Failed to retrieve queue, please try again.')

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })

            console.log(error)
        }
    }
}