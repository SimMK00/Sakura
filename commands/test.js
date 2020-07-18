module.exports = {
    name: "test",
    description: "",
    async execute(msg, args) {
        const Discord = require("discord.js");
        const embed = new Discord.MessageEmbed()
            .setColor("#C70039")
            .setTitle("?")
            .addFields(
                {name: "first", value: "1"},
                {name: "second", value: "2nd"},
            )
        msg.channel.send(embed);
    }                                               
}