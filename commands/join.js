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

            if (!interaction.member.voice.channel){
                return interaction.reply('You need to be in a voice channel!')
            } else {

                const connection = voice.joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                })
                
                interaction.guild.voiceConnection = connection;
                
                const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()
                })
                .setDescription(`Joined voice channel: ${interaction.member.voice.channel.name}`)
        
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                })
        

            }
        } catch (error) {
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()
                })
                .setDescription("Failed to join the voice channel")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

            console.log(error)
        }
       
    }
}