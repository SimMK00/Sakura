const { SlashCommandBuilder } = require('@discordjs/builders');
const { getAudioPlayer, getPlaysounds, playPlaysoundSelect} = require('../utils/audioUtils.js');
const voice = require("@discordjs/voice"); 
const Discord = require('discord.js');
const { ComponentType } = require('discord.js');

var pageNum = 1;
var playsoundSelectController = null;
var playsoundButtonCollector = null;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playsound")
        .setDescription("Plays a playsound")
        .addStringOption(option=>
            option.setName("playsoundname")
            .setRequired(true)
            .setDescription("Name of playsound")),
    /**
     * 
     * @param {Discord.BaseCommandInteraction} interaction 
     */
    async execute(interaction){

        const playsoundName = interaction.options.get("playsoundname").value;
        const baseUrl = "https://www.myinstants.com/api/v1";

        var response = null;
        var components = null;

        // Create colletor for dropdown select options
        if (playsoundSelectController) playsoundSelectController.stop();

        playsoundSelectController = interaction.channel.createMessageComponentCollector(
            {
                filter: (i) => i.customId === 'playsoundSelect', 
                componentType: ComponentType.StringSelect
            });
        playsoundSelectController.on('collect', compInteraction => {
            updateSelectOptions(compInteraction)
        });

        // Create colletor for button 
        if (playsoundButtonCollector) playsoundButtonCollector.stop();

        playsoundButtonCollector = interaction.channel.createMessageComponentCollector({
            filter: (i) => i.customId === 'playsoundNextButton' || i.customId === 'playsoundPrevButton', 
            componentType: ComponentType.Button
        });
        playsoundButtonCollector.on('collect', compInteraction => {
            if (compInteraction.customId === 'playsoundNextButton'){
                ++pageNum;
            } else {
                --pageNum;
            }
            updateNavButtons(compInteraction, playsoundName, baseUrl, pageNum);
        });

        // Default embed settings
        const replyEmbed = new Discord.EmbedBuilder()
            .setAuthor({
            name: `${interaction.user.username}`,
            iconURL: interaction.user.avatarURL()
            })
            .setColor("LuminousVividPink");

        let player = getAudioPlayer(interaction);
        let songQueue = interaction.client.queue.get(interaction.guild.id)
        if (player.state.status == voice.AudioPlayerStatus.Playing || songQueue){
            replyEmbed.setDescription("Please make sure there are no songs/playsounds currently in queue or playing")

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


async function updateNavButtons(interaction, playsoundName, baseUrl, pageNum){
    const response = getPlaysounds(playsoundName, baseUrl, pageNum)

    response
        .then(async function(response){
            var hasNext = response.next;
            var hasPrev = response.previous;
            
            const results = response.results;
            const actionRowButton = new Discord.ActionRowBuilder();
            
            if (hasPrev){
                actionRowButton.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("playsoundPrevButton")
                        .setLabel("Previous")
                        .setStyle("Secondary")
                )
            }

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

            await interaction.update({
                components: components,
                ephemeral: true
            })

        }).catch(async function(error){
            console.log(error)
        })
}

async function updateSelectOptions(interaction){
    const player = getAudioPlayer(interaction);
    const baseUrl = "http://www.myinstants.com/media/sounds/"
    if (player.state.status != voice.AudioPlayerStatus.Playing){
        // Disable interaction failed message
        await interaction.deferUpdate();

        if (interaction.values[0] == "EMPTY") return;
        playPlaysoundSelect(baseUrl, player, interaction);
    } else {

        const replyEmbed = new Discord.EmbedBuilder()
            .setAuthor({
            name: `${interaction.user.username}`,
            iconURL: interaction.user.avatarURL()
            })
            .setColor("LuminousVividPink")
            .setDescription("The bot is currently playing another audio track.")
        
        await interaction.reply({
            embeds: [replyEmbed],
            ephemeral: true
        })
    }
}