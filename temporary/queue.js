module.exports = {
    name: "queue",
    description: "Displays current songs queued",
    execute(msg) {
        const serverQueue = msg.client.queue.get(msg.guild.id);
        let output = ``;

        if (serverQueue) {
            for (i = 0; i < serverQueue.songs.length; i++) {
                output += `${i+1}: **${serverQueue.songs[i].title}**\n`;
            }
            msg.channel.send(output);
        };
    }
}