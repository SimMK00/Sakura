const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("prune")
        .setDescription("Bulk delete messages")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setRequired(true)
                .setDescription("Number of messages to delete")
        ),
    /**
     * 
     * @param {Discord.BaseCommandInteraction} interaction 
     */
    async execute(interaction){

        try {
            const numDelete = interaction.options.getInteger("amount");
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.tag}`,
                    iconURL: interaction.user.avatarURL()
                })
                .setTitle(`Bulk delete`)
                .setDescription(`${numDelete} messages deleted`)
                .setColor("LuminousVividPink")

            await interaction.channel.bulkDelete(numDelete)

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            }).then(setTimeout(() => {
                interaction.deleteReply()
            }, 2000))

        } catch(error){

            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()
                })
                .setColor("LuminousVividPink")
                .setDescription("Failed to delete messages")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

            console.log(error)

        }
    }
}