const Voice = require('@discordjs/voice');
const axios = require("axios").default;
const Discord = require('discord.js')

/**
 * 
 * @param {Discord.BaseInteraction} interaction 
 * @returns 
 */
function getAudioPlayer(interaction){
    try {
        let player = interaction.client.players.get(interaction.guild.id);

        if (!player){
            player = new Voice.AudioPlayer()

            interaction.client.players.set(interaction.client.players.set(interaction.guild.id, player))
        }

        return player;
    } catch (error) {
        console.log(error)
    }
}

function playPlaysoundSelect(baseUrl, player, interaction){
    try {
        // Reconstructing url
        audioUrl = baseUrl + interaction.values[0];
    
        // Create audio resource 
        let resource = Voice.createAudioResource(audioUrl);
    
        // Establish a connection to the voice channel
        let connection = establishConnection(interaction);

        // Plays the audio resource
        player.play(resource);
        connection.subscribe(player);
    } catch (error) {
        console.log(error)
    }
}

function getPlaysounds(playsoundName, baseUrl, pageNum){
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

function establishConnection(interaction){

    try {
        let connection = Voice.getVoiceConnection(interaction.guildId);
        if (!connection || connection.state.status == 'disconnected'){
            connection = Voice.joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator
            })
        }
    
        return connection
    } catch (error) {
        console.log(error)
    }

}



module.exports = {
    getAudioPlayer,
    playPlaysoundSelect,
    getPlaysounds,
    establishConnection,
    // playSong,
    // playerListener
}