module.exports = {
    name: "volume",
    description: "Controls the volume of the playback",
    async execute(msg){
        const serverQueueV = await msg.client.queue.get(msg.guild.id);

        if (serverQueueV){
          dispatcherV = await serverQueueV.connection;
          dispatcherV.setVolume(args[1]);
        }
    }
}