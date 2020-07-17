module.exports = {
    name: "avatar",
    description: "Returns avatar of user specified",
    execute(msg,args) {
        let Discord = require('discord.js');
        let embed = new Discord.MessageEmbed();
        if (!args[1]) {
            msg.channel.send(embed.setImage(`${msg.author.avatarURL({ size: 2048 })}`));
        } else if (msg.mentions.users.first()) {
            let user = msg.mentions.users.first();
            msg.channel.send(embed.setImage(`${user.avatarURL({ size: 2048 })}`));
        } else {
            msg.channel.send(`Valid user please you ignorant swine`);
        }
    }
}