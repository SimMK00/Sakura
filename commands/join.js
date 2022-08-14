const { SlashCommandBuilder } = require('@discordjs/builders');
const voice = require("@discordjs/voice");
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Joins the voice channel the user is in"),
    /**
     * 
     *  @param {Discord.BaseCommandInteraction} interaction  
     */
    async execute(interaction){
        try {
            const embed = new Discord.MessageEmbed();
            embed.setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL()
            }).setColor("LUMINOUS_VIVID_PINK")
            .setDescription("joined");
    
            await interaction.reply({
                embeds: [
                    embed
                ],
                ephemeral: true
            })
    
            const connection = voice.joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })
            
            
            interaction.voiceConnection = connection;


        } catch (error) {
            console.log(error)
        }
       
    }
}