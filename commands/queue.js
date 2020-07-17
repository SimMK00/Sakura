module.exports = {
    name: "queue",
    description: "Displays current songs queued",
    execute(msg) {
        const serverQueue = msg.client.queue.get(msg.guild.id);
        
        if (serverQueue) {
            for (i = 0; i < serverQueue.songs.length; i++) {
                msg.channel.send(serverQueue.songs[i].title);
            }
        };
    }
}