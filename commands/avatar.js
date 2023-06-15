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

        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: `${interaction.user.username}`,
                iconURL: interaction.user.avatarURL()
            })
            .setColor("LuminousVividPink")

        try {
            const user = interaction.options.getUser("target");
            const size = interaction.options.getInteger("size");
            embed
                .setTitle(`Avatar of ${user.username}`)
                .setImage(user.avatarURL({size: size}))

        } catch (error){
            embed 
                .setDescription("Failed to get avatar of user")

            console.log(error)
        } finally {
            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })

        }
    }
}