// require the discord.js module
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
    console.log('Ready!');
    
});

client.on("message", msg => {
    let args = msg.content.substring(prefix.length).split(" ");
    let embed = new Discord.MessageEmbed()
    switch(args[0]){
        case 'ping':
            msg.channel.send(`Pong!\nThe latency is ${Date.now()-msg.createdTimestamp}ms`)

        case 'prune':
            if(!args[1]){
                msg.channel.send(`Please provide a valid number~`).then(d_msg =>{d_msg.delete({timeout:5000})});
            } else {
                msg.channel.bulkDelete(args[1]);
                msg.channel.send(`${args[1]} messages have been deleted!`).then(d_msg =>{d_msg.delete({timeout:5000})});
            }
        case 'flip':
            let flipnum = Math.round(Math.random());
            if (flipnum == 0){
                msg.channel.send(`${msg.author.username} has flipped **head**`,{files:["./images/head.png"]})
            } else {
                msg.channel.send(`${msg.author.username} has flipped **tail**`,{files:["./images/tail.png"]})
            }
           
        case 'play':
    
    }
    
})

// login to Discord with your app's token
client.login(token);