module.exports = {
    name: "ping",
    description: "Returns latency",
    execute(msg){
        msg.channel.send(`Pong!\nThe latency is ${Date.now()-msg.createdTimestamp}ms`);
    } 
}