module.exports = {
    name: "purge",
    description: "Removes all queued song",
    execute(msg){
        let serverQueue = msg.client.queue.get(msg.guild.id);
        
        if (serverQueue){
            msg.client.queue.delete(msg.guild.id);
            msg.channel.send("All queued songs removed ヽ(•‿•)ノ")
        } 
    }
}