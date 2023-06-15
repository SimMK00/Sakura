const { SlashCommandBuilder } = require('@discordjs/builders');
const Voice = require("@discordjs/voice");
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

        // Default embed
        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })
            .setColor("LuminousVividPink")
        try {

            if (!interaction.member.voice.channel){
                embed.setDescription('You need to be in a voice channel')
            } else {

                Voice.joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                })
                
                embed.setDescription(`Joined voice channel: ${interaction.member.voice.channel.name}`)
            }
        } catch (error) {
            embed.setDescription("Failed to join the voice channel")

            console.log(error)
        } finally {
            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })
        }
       
    }
}