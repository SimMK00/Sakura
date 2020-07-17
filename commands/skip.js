module.exports = {
    name: "skip",
    description: "Skips the current song",
    execute(msg) {
        const serverQueue = msg.client.queue.get(msg.guild.id);

        skip(msg, serverQueue);
        function skip(msg, serverQueue) {
            if (!msg.member.voice.channel)
                return msg.channel.send(
                    "You have to be in a voice channel to stop the music!"
                );
            if (!serverQueue)
                return msg.channel.send("The queue is already empty! ( ︶︿︶)_╭∩╮");
            msg.channel.send(`The song **${serverQueue.songs[0].title}** has been skipped ヽ(•‿•)ノ `);
            serverQueue.connection.dispatcher.end();
        }
    }
}