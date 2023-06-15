const Voice = require('@discordjs/voice')
const axios = require("axios").default;
var player = null;

module.exports = {
    getAudioPlayer: ()=>{
        try {
            if (!player){
                player = new Voice.AudioPlayer();
            }

            return player;
        } catch (error) {
            console.log(error)
        }

    },
    playPlaysoundSelect: (baseUrl, player, interaction)=>{

        try {
            // Reconstructing url
            audioUrl = baseUrl + interaction.values[0];
        
            // Create audio resource 
            let resource = Voice.createAudioResource(audioUrl);
        
            // Establish a connection to the voice channel

            connection = Voice.joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })

            // Plays the audio resource
            player.play(resource);
            connection.subscribe(player);
        } catch (error) {
            console.log(error)
        }
       
    },
    playPlaysoundExact: (response, player, interaction)=>{
        try {
            let resource = Voice.createAudioResource(response.sound);
    
            // Establishing a connection to the channel
            let connection = Voice.getVoiceConnection(interaction.guildId);
            if (!connection){
                connection = Voice.joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                })
            }
            
            // Play the resource
            player.play(resource);
            connection.subscribe(player);
        } catch (error) {
            console.log(error)
        }
        
    },

    getPlaysounds: (playsoundName, baseUrl, pageNum) =>{
        try {
             // Construct parameter
            let params = {
                name: playsoundName,
                page: pageNum
            };
        
            return new Promise((resolve, reject)=>{
                axios({
                    url: "/instants",
                    baseURL: baseUrl,
                    method: "get",
                    params: params,
                    timeout: 3000
                }).then((response)=>{
                    resolve(response.data);
                }).catch((error)=>{
                    reject(error);
                })
            })
        } catch (error) {
            console.log(error)
        }
       
    }
    
}