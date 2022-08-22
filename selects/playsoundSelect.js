const Discord = require('discord.js');
const Voice = require("@discordjs/voice");

module.exports = {
    name: "playsoundSelect",
    /**
     * 
     * @param {Discord.MessageComponentInteraction} interaction 
     */
    async execute(interaction) {
        const embed = new Discord.MessageEmbed();
        const player = new Voice.AudioPlayer();
        const baseUrl = "http://www.myinstants.com/media/sounds/"

        // Disable interaction failed message
        await interaction.deferUpdate();

        if (interaction.values[0] == "EMPTY") return;
        playPlaysound(baseUrl, player, interaction);
    }
}

function playPlaysound(baseUrl, player, interaction){

    // Reconstructing url
    audioUrl = baseUrl + interaction.values[0];

    // Create audio resource 
    let resource = Voice.createAudioResource(audioUrl);

    // Establish a connection to the voice channel
    let connection = Voice.getVoiceConnection(interaction.guildId);
    if (!connection){
        connection = Voice.joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator
        })
    }
    
    // Plays the audio resource
    player.play(resource);
    connection.subscribe(player);
}