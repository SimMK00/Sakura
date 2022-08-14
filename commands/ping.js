const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Returns latency"),
    async execute(interaction){
        await interaction.reply(`Pong!\nThe latency is ${Date.now()-interaction.createdTimestamp}ms`);
    } 
}