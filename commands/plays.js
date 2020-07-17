module.exports = {
    name: "plays",
    description: "Plays a playsound",
    async execute(msg, args) {
        const voiceChannel = msg.member.voice.channel;
        let checkQueue = msg.client.queue.get(msg.guild.id);

        if (checkQueue) {
            queue.delete(msg.guild.id);
        } else if (!voiceChannel) {
            msg.channel.send(`You need to join a voice channel first`);
        } else if (voiceChannel) {
            var connectionps = await voiceChannel.join();
        }

        async function playsound(casename, looptime) {
            let looptimef = looptime;
            const dispatcher = connectionps.play(casename);
            if (args[2] > 0 && args[2] <= 10 /*&& msg.author.id == 1364621891197992968*/) {
                await dispatcher.setVolume(args[2]);
            } else {
                dispatcher.setVolume(0.5);
            }
            looptimef--;
            dispatcher.on("finish", () => {
                if (looptimef != 0) {
                    playsound(casename, looptimef);
                    looptimef = looptime - 1;
                }
            })
        }

        if (args[1]) {
            if (args[3] > 0 && args[3] <= 10) {
                playsound(`./playsounds/${args[1]}.mp3`, args[3]);
            } else if (!args[3]) {
                playsound(`./playsounds/${args[1]}.mp3`, 1);
            } else {
                msg.channel.send(`Please don't loop so many times`);
            }
        } else {
            playsound(`./playsounds/${args[1]}.mp3`, 1);
        }

        msg.delete({ timeout: 2000 });

    }
}