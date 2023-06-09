const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
    
const imageSizes = [16,32,64,128,256,512,1024,2048,4096]
const choices = imageSizes.map((size)=>({
    name: `${size}px`,
    value: size
}))

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Returns avatar of user specified")
        .addUserOption((option)=>
            option
                .setName("target")
                .setDescription("Select a user"))
        .addIntegerOption((option)=>
            option
                .setName("size")
                .setDescription("Select size of the avatar")
                .addChoices(...choices)),
    /**
     * 
     * @param {Discord.BaseCommandInteraction} interaction 
     */
    async execute(interaction) {
        try {
            const user = interaction.options.getUser("target");
            const size = interaction.options.getInteger("size");
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()
                })
                .setTitle(`Avatar of ${user.username}`)
                .setImage(user.avatarURL({size: size}))
                .setColor("LuminousVividPink")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

        } catch (error){
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL()
                })
                .setColor("LuminousVividPink")
                .setDescription("Failed to get avatar of user")

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

            console.log(error)
        }
    }
}