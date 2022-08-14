const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("prune")
        .setDescription("Bulk delete messages")
        .addIntegerOption(option =>
            option.setName("number")
            .setDescription("Number of messages to delete")),
    /**
     * 
     * @param {Discord.BaseCommandInteraction} interaction 
     */
    async execute(interaction){
        const numDelete = interaction.options.getInteger("number");
        const embed = new Discord.MessageEmbed();

        await interaction.channel.bulkDelete(numDelete)
        await interaction.reply({
            embeds: [
                embed.setAuthor({
                    name: `${interaction.user.tag}`,
                    iconURL: interaction.user.avatarURL()
                }).setTitle(`Bulk delete`).setDescription(`${numDelete} messages deleted`)
                .setColor("LUMINOUS_VIVID_PINK")
            ]
        }).then(setTimeout(() => {
            interaction.deleteReply()
        }, 2000))
    } 
}