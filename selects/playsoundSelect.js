const Discord = require('discord.js');
const Voice = require("@discordjs/voice");
const { getAudioPlayer, playPlaysoundSelect } = require('../utils/audioUtils.js')

module.exports = {
    name: "playsoundSelect",
    /**
     * 
     * @param {Discord.MessageComponentInteraction} interaction 
     */
    async execute(interaction) {
        const player = getAudioPlayer();
        const baseUrl = "http://www.myinstants.com/media/sounds/"
        if (player.state.status != Voice.AudioPlayerStatus.Playing){
            // Disable interaction failed message
            await interaction.deferUpdate();

            if (interaction.values[0] == "EMPTY") return;
            playPlaysoundSelect(baseUrl, player, interaction);
        } else {

            const replyEmbed = new Discord.EmbedBuilder()
                .setAuthor({
                name: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
                })
                .setColor("LuminousVividPink")
                .setDescription("The bot is currently playing another playsound.")
            
            await interaction.reply({
                embeds: [replyEmbed],
                ephemeral: true
            })
        }
    }
}