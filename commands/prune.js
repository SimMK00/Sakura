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
        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL()
            })
            .setTitle(`Bulk delete`)
            .setColor("LuminousVividPink")

        try {
            const numDelete = interaction.options.getInteger("amount");

            embed.setDescription(`${numDelete} messages deleted`);

            await interaction.channel.bulkDelete(numDelete)

        } catch(error){

            embed.setDescription("Failed to delete messages")

            console.log(error)

        } finally {
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }
    }
}