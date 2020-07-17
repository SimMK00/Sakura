module.exports = {
    name: "leave",
    description: "Leaves the voice channel",
    execute(msg) {
        const voiceChannel = msg.member.voice.channel;
        const serverQueue = msg.client.queue.get(msg.guild.id);

        if (serverQueue) {
            queue.delete(msg.guild.id);
        }
        voiceChannel.leave();
    }
}