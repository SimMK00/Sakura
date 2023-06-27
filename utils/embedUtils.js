const Discord = require('discord.js')

function createEmbedBase(interaction){
    const embed = new Discord.EmbedBuilder()
        .setAuthor({
            name: `${interaction.user.username}`,
            iconURL: interaction.user.avatarURL()
        })
        .setColor("LuminousVividPink")

    return embed;
}


module.exports = {
    createEmbedBase,
}