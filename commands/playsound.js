const { SlashCommandBuilder } = require('@discordjs/builders');
const { getAudioPlayer } = require('../state/playerState.js');
const { playPlaysoundExact, getPlaysounds} = require('../utils/audioUtils.js');
const voice = require("@discordjs/voice"); 
const Discord = require('discord.js');
const player = getAudioPlayer();
const { ComponentType } = require('discord.js');

var pageNum = 1;
var stringSelectCollector = null;
var buttonCollector = null;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playsound")
        .setDescription("Plays a playsound")
        .addStringOption(option=>
            option.setName("playsoundname")
            .setRequired(true)
            .setDescription("Name of playsound"))
        .addBooleanOption(option=>
            option.setName("exact")
            .setRequired(true)
            .setDescription("Search for exact playsound")),
    /**
     * 
     * @param {Discord.BaseCommandInteraction} interaction 
     */
    async execute(interaction){

        const playsoundName = interaction.options.get("playsoundname").value;
        const exactMatch = interaction.options.get("exact").value;
        const baseUrl = "https://www.myinstants.com/api/v1";

        var response = null;
        var components = null;

        // Create colletor for dropdown select options
        if (stringSelectCollector) stringSelectCollector.stop();

        stringSelectCollector = interaction.channel.createMessageComponentCollector(
            {
                filter: (i) => i.customId === 'playsoundSelect', 
                componentType: ComponentType.StringSelect
            });
        stringSelectCollector.on('collect', compInteraction => {
            interaction.client.selects.get(compInteraction.customId).execute(compInteraction);
        });

        // Create colletor for button 
        if (buttonCollector) buttonCollector.stop();

        buttonCollector = interaction.channel.createMessageComponentCollector({
            filter: (i) => i.customId === 'playsoundNextButton' || i.customId === 'playsoundPrevButton', 
            componentType: ComponentType.Button
        });
        buttonCollector.on('collect', compInteraction => {
            if (compInteraction.customId === 'playsoundNextButton'){
                ++pageNum;
            } else {
                --pageNum;
            }
            interaction.client.buttons.get('playsoundNavButtons').execute(compInteraction, playsoundName, baseUrl, pageNum)
        });

        // Default embed settings
        const replyEmbed = new Discord.EmbedBuilder()
            .setAuthor({
            name: `${interaction.user.username}`,
            iconURL: interaction.user.avatarURL()
            })
            .setColor("LuminousVividPink");

        if (player.state.status == voice.AudioPlayerStatus.Playing){
            replyEmbed.setDescription("The bot is currently playing another playsound.")

            return await interaction.reply({
                embeds: [replyEmbed],
                ephemeral: true
            })
        }

        try {

            response = getPlaysounds(playsoundName, baseUrl, pageNum);

            response
                .then(async function(response){
                    const results = response.results;
                    
                    // No playsound found
                    if (results.length == 0){
                        replyEmbed.setDescription('No playsound found');
                        
                    // Playsound found
                    } else {

                        // Play one playsound only
                        if (exactMatch){

                            var playsound = results[0];
                            playPlaysoundExact(playsound, player, interaction);
            
                            replyEmbed.setDescription(`Playing: ${playsound.name}`)

                            await interaction.reply({
                                embeds: [replyEmbed],
                                ephemeral: true
                            }) 
                            
                        } else {
                            let hasNext = response.next;
                            
                            const actionRowButton = new Discord.ActionRowBuilder();
                            if (hasNext){
                                actionRowButton.addComponents(
                                    new Discord.ButtonBuilder()
                                        .setCustomId("playsoundNextButton")
                                        .setLabel("Next")
                                        .setStyle("Secondary")
                                )
                            }
        
                            const selectMenu = new Discord.StringSelectMenuBuilder()
                                .setCustomId("playsoundSelect")
                                .setPlaceholder("Playsounds");
        
                            const actionRowSelect = new Discord.ActionRowBuilder()
                                .addComponents(selectMenu);
        
                            // Add all playsounds as option
                            results.forEach(element => {
                                url = element.sound.split('/');
                                trimmedUrl = url[url.length-1]
    
                                selectMenu.addOptions({
                                    label: element.name,
                                    value: trimmedUrl
                                })
                            });
                            
                            components = [actionRowSelect];
                            if (hasNext) components.push(actionRowButton);
                            
                            await interaction.reply({
                                components: components,
                                ephemeral: true
                            })
                        }
                    }

                }).catch(async function(error){
                    replyEmbed.setDescription('Failed to play a playsound')

                    await interaction.reply({
                        embeds: [replyEmbed],
                        ephemeral: true
                    }) 

                    console.log(error)
                })

        } catch (error) {
            replyEmbed.setDescription('Something went wrong, please try again')

            console.log(error)
        } 
    } 
}
