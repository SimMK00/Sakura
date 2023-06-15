const Voice = require('@discordjs/voice')

var player = null;

module.exports = {
    getAudioPlayer: ()=>{
        if (!player){
            player = new Voice.AudioPlayer();
        }

        return player
    }
}