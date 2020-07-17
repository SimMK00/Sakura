module.exports = {
    name: "join",
    description: "Joins the voice channel",
    execute(msg){
        const voiceChannel = msg.member.voice.channel;

        if(voiceChannel){
            voiceChannel.join();
            msg.channel.send(`Successfully joined!`);
        } else {
            msg.channel.send(`Please join a voice channel first`);
        }
    }
}