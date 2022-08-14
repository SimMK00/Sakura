const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
    
module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Returns avatar of user specified")
        .addUserOption(option=>
            option.setName("target")
            .setDescription("Select a user"))
        .addIntegerOption(option => 
            option.setName("size")
            .setDescription("Select size of the avatar")
            .addChoices(
                {name: "16",value: 16},
                {name: "32",value: 32},
                {name: "56",value: 56},
                {name: "64",value: 64},
                {name: "96",value: 96},
                {name: "128",value: 128},
                {name: "256",value: 256},
                {name: "300",value: 300},
                {name: "512",value: 512},
                {name: "600",value: 600},
                {name: "1024",value: 1024},
                {name: "2048",value: 2048},
                {name: "4096",value: 4096},
            )),
    /**
     * 
     * @param {Discord.BaseCommandInteraction} interaction 
     */
    async execute(interaction) {
        const embed = new Discord.MessageEmbed();
        const user = interaction.options.getUser("target");
        const size = interaction.options.getInteger("size");
        await interaction.reply({
            embeds: [
                embed.setAuthor({
                    name: `${interaction.user.tag}`,
                    iconURL: interaction.user.avatarURL()
                }).setTitle(`Avatar of ${user.tag}`).setImage(user.avatarURL({size: size}))
                .setColor("LUMINOUS_VIVID_PINK")
            ]
        })
        
    }
}