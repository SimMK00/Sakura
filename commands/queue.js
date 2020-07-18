module.exports = {
    name: "queue",
    description: "Displays current songs queued",
    execute(msg) {
        const serverQueue = msg.client.queue.get(msg.guild.id);
        
        if (serverQueue) {
            for (i = 0; i < serverQueue.songs.length; i++) {
                output += `${i}: **${serverQueue.songs[i].title}**`;
            }
            msg.channel.send(output);
        };
    }
}